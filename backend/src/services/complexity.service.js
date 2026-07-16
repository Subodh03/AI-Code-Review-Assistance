// Lightweight, language-aware complexity metrics.
// This does NOT build a real AST — it's a fast heuristic pass good enough for
// dashboard-level metrics. Swap in `radon` (Python) or an AST-based JS parser
// (e.g. `escomplex`/`typescript` compiler API) for exact figures later.

const FUNCTION_PATTERNS = {
  python: /^\s*def\s+\w+\s*\(/gm,
  javascript: /\bfunction\s+\w*\s*\(|\b\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>|\b\w+\s*\([^)]*\)\s*\{/gm,
  typescript: /\bfunction\s+\w*\s*\(|\b\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>/gm,
};

const CLASS_PATTERNS = {
  python: /^\s*class\s+\w+/gm,
  javascript: /\bclass\s+\w+/gm,
  typescript: /\bclass\s+\w+/gm,
};

// Branching / decision-point keywords, one heuristic set covering
// Python, JS and TS. Cyclomatic complexity = 1 + number of decision points.
const BRANCH_KEYWORDS = /\b(if|elif|else if|for|while|case|catch|except|&&|\|\||\?\s*[^:]+:)\b/g;

function countMatches(str, pattern) {
  const matches = str.match(pattern);
  return matches ? matches.length : 0;
}

function computeComplexity(language, code) {
  const lines = code.split(/\r\n|\r|\n/);
  const linesOfCode = lines.filter((l) => l.trim().length > 0).length;

  const functionPattern = FUNCTION_PATTERNS[language] || FUNCTION_PATTERNS.javascript;
  const classPattern = CLASS_PATTERNS[language] || CLASS_PATTERNS.javascript;

  const functionCount = countMatches(code, functionPattern);
  const classCount = countMatches(code, classPattern);

  // +1 base path, then one extra path per decision point found anywhere in the file.
  const decisionPoints = countMatches(code, BRANCH_KEYWORDS);
  const cyclomaticComplexity = 1 + decisionPoints;

  return {
    lines_of_code: linesOfCode,
    function_count: functionCount,
    class_count: classCount,
    cyclomatic_complexity: cyclomaticComplexity,
  };
}

module.exports = { computeComplexity };
