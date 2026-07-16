const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { randomUUID } = require("crypto");

const SEVERITY_MAP = {
  fatal: "critical",
  error: "critical",
  warning: "warning",
  convention: "info",
  refactor: "info",
};


function runPylint(code) {
  return new Promise((resolve) => {
    const tmpFile = path.join(os.tmpdir(), `review-${randomUUID()}.py`);
    fs.writeFileSync(tmpFile, code, "utf8");

   
    exec(
      `pylint --output-format=json --disable=C0114,C0116 "${tmpFile}"`,
      { timeout: 15000, maxBuffer: 1024 * 1024 * 10 },
      (error, stdout) => {
        fs.unlink(tmpFile, () => {});

        if (!stdout) {
          if (error && /not found|not recognized/i.test(error.message)) {
            return resolve({
              issues: [],
              toolAvailable: false,
              note: "Pylint is not installed on this server. Install it with `pip install pylint` to enable static analysis for Python.",
            });
          }
          return resolve({ issues: [], toolAvailable: true, note: null });
        }

        let parsed = [];
        try {
          parsed = JSON.parse(stdout);
        } catch {
          return resolve({ issues: [], toolAvailable: true, note: "Could not parse Pylint output." });
        }

        const issues = parsed.map((item) => ({
          source: "static",
          category: item["message-id"] ? `pylint:${item["message-id"]}` : "style",
          severity: SEVERITY_MAP[item.type] || "info",
          line_number: item.line || null,
          message: item.message,
          suggestion: item.symbol ? `Rule: ${item.symbol}` : null,
        }));

        resolve({ issues, toolAvailable: true, note: null });
      }
    );
  });
}


async function runEslintStub() {
  return {
    issues: [],
    toolAvailable: false,
    note: "JavaScript/TypeScript static analysis (ESLint) is not wired up yet. Add an eslintrc + eslint dependency and implement this the same way runPylint() works.",
  };
}

async function runStaticAnalysis(language, code) {
  switch (language) {
    case "python":
      return runPylint(code);
    case "javascript":
    case "typescript":
      return runEslintStub();
    default:
      return {
        issues: [],
        toolAvailable: false,
        note: `No static analysis tool is configured for "${language}" yet.`,
      };
  }
}

module.exports = { runStaticAnalysis };
