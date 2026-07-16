const fs = require("fs");
const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { runStaticAnalysis } = require("../services/staticAnalysis.service");
const { runAiReview } = require("../services/aiReview.service");
const { computeComplexity } = require("../services/complexity.service");

function summarizeSeverity(issues) {
  return issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});
}

async function insertIssues(client, reviewId, issues) {
  for (const issue of issues) {
    await client.query(
      `INSERT INTO review_issues (review_id, source, category, severity, line_number, message, suggestion)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        reviewId,
        issue.source,
        issue.category,
        issue.severity,
        issue.line_number,
        issue.message,
        issue.suggestion,
      ]
    );
  }
}

// Shared pipeline used by both "paste code" and "upload file" submission.
async function createReview({ userId, title, language, code, sourceType, originalFilename }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const complexity = computeComplexity(language, code);
    const staticResult = await runStaticAnalysis(language, code);

    let aiResult;
    try {
      aiResult = await runAiReview(language, code);
    } catch (err) {
      // AI failures shouldn't take down the whole review -- static results still get saved.
      aiResult = { summary: null, documentation: null, issues: [], available: false, note: err.message };
    }

    const allIssues = [...staticResult.issues, ...aiResult.issues];
    const severitySummary = summarizeSeverity(allIssues);

    const notes = [staticResult.note, aiResult.note].filter(Boolean).join(" ");
    const aiSummary = [aiResult.summary, notes ? `\n\n(${notes})` : ""].filter(Boolean).join("");

    const reviewInsert = await client.query(
      `INSERT INTO reviews
        (user_id, title, language, source_type, original_filename, code,
         lines_of_code, function_count, class_count, cyclomatic_complexity,
         severity_summary, ai_summary, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'completed')
       RETURNING *`,
      [
        userId,
        title,
        language,
        sourceType,
        originalFilename || null,
        code,
        complexity.lines_of_code,
        complexity.function_count,
        complexity.class_count,
        complexity.cyclomatic_complexity,
        JSON.stringify(severitySummary),
        aiSummary || null,
      ]
    );

    const review = reviewInsert.rows[0];
    await insertIssues(client, review.id, allIssues);

    await client.query("COMMIT");
    return { review, issues: allIssues, documentation: aiResult.documentation };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

const submitPastedCode = asyncHandler(async (req, res) => {
  const { title, language, code } = req.body;
  if (!code || !language) {
    return res.status(400).json({ message: "Language and code are required." });
  }

  const result = await createReview({
    userId: req.user.id,
    title: title || `Pasted snippet - ${new Date().toLocaleString()}`,
    language,
    code,
    sourceType: "paste",
  });

  res.status(201).json(result);
});

const submitUploadedFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const { language } = req.body;
  if (!language) {
    return res.status(400).json({ message: "Language is required." });
  }

  const code = fs.readFileSync(req.file.path, "utf8");

  const result = await createReview({
    userId: req.user.id,
    title: req.file.originalname,
    language,
    code,
    sourceType: "upload",
    originalFilename: req.file.originalname,
  });

  // The source has been persisted into the `reviews.code` column; the temp
  // upload on disk is no longer needed.
  fs.unlink(req.file.path, () => {});

  res.status(201).json(result);
});

const listReviews = asyncHandler(async (req, res) => {
  const { search, severity, language, page = 1, pageSize = 10 } = req.query;

  const conditions = ["user_id = $1"];
  const params = [req.user.id];
  let idx = 2;

  if (search) {
    conditions.push(`(title ILIKE $${idx} OR code ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }
  if (language) {
    conditions.push(`language = $${idx}`);
    params.push(language);
    idx++;
  }
  if (severity) {
    conditions.push(`severity_summary ? $${idx}`);
    params.push(severity);
    idx++;
  }

  const whereClause = conditions.join(" AND ");
  const offset = (Number(page) - 1) * Number(pageSize);

  const [rows, count] = await Promise.all([
    pool.query(
      `SELECT id, title, language, source_type, lines_of_code, function_count,
              class_count, cyclomatic_complexity, severity_summary, status, created_at
       FROM reviews
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, Number(pageSize), offset]
    ),
    pool.query(`SELECT COUNT(*) FROM reviews WHERE ${whereClause}`, params),
  ]);

  res.json({
    reviews: rows.rows,
    total: Number(count.rows[0].count),
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

const getReviewDetail = asyncHandler(async (req, res) => {
  const review = await pool.query("SELECT * FROM reviews WHERE id = $1 AND user_id = $2", [
    req.params.id,
    req.user.id,
  ]);
  if (review.rows.length === 0) {
    return res.status(404).json({ message: "Review not found." });
  }

  const issues = await pool.query(
    "SELECT * FROM review_issues WHERE review_id = $1 ORDER BY severity, line_number NULLS LAST",
    [req.params.id]
  );

  res.json({ review: review.rows[0], issues: issues.rows });
});

const deleteReview = asyncHandler(async (req, res) => {
  const result = await pool.query("DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id", [
    req.params.id,
    req.user.id,
  ]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Review not found." });
  }
  res.json({ message: "Review deleted." });
});

const dashboardStats = asyncHandler(async (req, res) => {
  const totals = await pool.query(
    `SELECT
        COUNT(*)::int AS total_reviews,
        COALESCE(SUM(lines_of_code), 0)::int AS total_loc,
        COALESCE(AVG(cyclomatic_complexity), 0)::float AS avg_complexity
     FROM reviews WHERE user_id = $1`,
    [req.user.id]
  );

  const severity = await pool.query(
    `SELECT severity_summary FROM reviews WHERE user_id = $1`,
    [req.user.id]
  );
  const severityTotals = severity.rows.reduce((acc, row) => {
    const s = row.severity_summary || {};
    for (const key of Object.keys(s)) acc[key] = (acc[key] || 0) + s[key];
    return acc;
  }, {});

  const recent = await pool.query(
    `SELECT id, title, language, severity_summary, created_at
     FROM reviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
    [req.user.id]
  );

  const languageBreakdown = await pool.query(
    `SELECT language, COUNT(*)::int AS count
     FROM reviews WHERE user_id = $1
     GROUP BY language ORDER BY count DESC`,
    [req.user.id]
  );

  // Review count per day for the last 14 days, zero-filled so the chart has no gaps.
  const trendRows = await pool.query(
    `SELECT date_trunc('day', created_at)::date AS day, COUNT(*)::int AS count
     FROM reviews
     WHERE user_id = $1 AND created_at >= now() - interval '13 days'
     GROUP BY day`,
    [req.user.id]
  );
  const trendByDay = Object.fromEntries(
    trendRows.rows.map((r) => [r.day.toISOString().slice(0, 10), r.count])
  );
  const trend = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    trend.push({ date: key, count: trendByDay[key] || 0 });
  }

  res.json({
    ...totals.rows[0],
    severityTotals,
    recentReviews: recent.rows,
    languageBreakdown: languageBreakdown.rows,
    trend,
  });
});

module.exports = {
  submitPastedCode,
  submitUploadedFile,
  listReviews,
  getReviewDetail,
  deleteReview,
  dashboardStats,
};
