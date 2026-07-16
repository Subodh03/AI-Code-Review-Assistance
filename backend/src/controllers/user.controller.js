const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, mobile_number, avatar_url, created_at FROM users WHERE id = $1",
    [req.user.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ user: result.rows[0] });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobile_number } = req.body;

  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         mobile_number = COALESCE($2, mobile_number),
         updated_at = now()
     WHERE id = $3
     RETURNING id, name, email, mobile_number, avatar_url, created_at`,
    [name, mobile_number, req.user.id]
  );

  res.json({ user: result.rows[0] });
});

const VALID_PRESETS = ["moss", "clay", "harbor", "wheat", "pine", "dune"];

const setAvatarPreset = asyncHandler(async (req, res) => {
  const { preset } = req.body;
  if (!VALID_PRESETS.includes(preset)) {
    return res.status(400).json({ message: "Unknown avatar preset." });
  }

  const result = await pool.query(
    `UPDATE users SET avatar_url = $1, updated_at = now()
     WHERE id = $2
     RETURNING id, name, email, mobile_number, avatar_url, created_at`,
    [`preset:${preset}`, req.user.id]
  );

  res.json({ user: result.rows[0] });
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Local dev serves uploads statically from /uploads (see server.js).
  // In production, replace this with the uploaded object's S3/Supabase URL.
  const avatarUrl = `/uploads/${req.file.filename}`;

  const result = await pool.query(
    `UPDATE users SET avatar_url = $1, updated_at = now()
     WHERE id = $2
     RETURNING id, name, email, mobile_number, avatar_url, created_at`,
    [avatarUrl, req.user.id]
  );

  res.json({ user: result.rows[0] });
});

module.exports = { getProfile, updateProfile, updateAvatar, setAvatarPreset };
