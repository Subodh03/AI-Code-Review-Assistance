const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../config/db");
const { signToken } = require("../utils/jwt");
const asyncHandler = require("../utils/asyncHandler");

const PUBLIC_USER_FIELDS =
  "id, name, email, mobile_number, avatar_url, created_at";

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${PUBLIC_USER_FIELDS}`,
    [name, email, passwordHash]
  );

  const user = result.rows[0];
  const token = signToken({ id: user.id, email: user.email });
  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken({ id: user.id, email: user.email });
  const { password_hash, reset_token, reset_token_expires, ...publicUser } = user;
  res.json({ user: publicUser, token });
});

// JWTs are stateless, so "logout" is a client-side action (discard the token).
// This endpoint exists for a consistent API surface and as an extension point
// if a token-blocklist is added later.
const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out." });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  // Always respond the same way whether or not the account exists, to avoid
  // leaking which emails are registered.
  if (result.rows.length === 0) {
    return res.json({ message: "If that email is registered, a reset link has been sent." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.query(
    "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3",
    [resetToken, expires, email]
  );

  // TODO: send this via a real email provider (SendGrid, Postmark, Nodemailer + SMTP, etc).
  // For now we log it so the flow is testable end-to-end locally.
  console.log(`[forgotPassword] Reset link for ${email}: /reset-password?token=${resetToken}`);

  res.json({ message: "If that email is registered, a reset link has been sent." });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const result = await pool.query(
    "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > now()",
    [token]
  );
  const user = result.rows[0];
  if (!user) {
    return res.status(400).json({ message: "This reset link is invalid or has expired." });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await pool.query(
    "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
    [passwordHash, user.id]
  );

  res.json({ message: "Password updated. You can now log in." });
});

module.exports = { signup, login, logout, forgotPassword, resetPassword };
