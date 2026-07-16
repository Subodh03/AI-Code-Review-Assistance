const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");
const {
  submitPastedCode,
  submitUploadedFile,
  listReviews,
  getReviewDetail,
  deleteReview,
  dashboardStats,
} = require("../controllers/review.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/dashboard-stats", dashboardStats);

router.post("/paste", submitPastedCode);
router.post("/upload", upload.single("file"), submitUploadedFile);

router.get("/", listReviews);
router.get("/:id", getReviewDetail);
router.delete("/:id", deleteReview);



module.exports = router;
