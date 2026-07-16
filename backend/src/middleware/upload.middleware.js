const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const maxSizeMb = Number(process.env.MAX_UPLOAD_SIZE_MB || 5);

// NOTE: for production, swap this disk storage for S3 / Supabase Storage
// and store the resulting public URL instead of a local path.
const upload = multer({
  storage,
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
});

module.exports = { upload, UPLOAD_DIR };
