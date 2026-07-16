const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");
const { getProfile, updateProfile, updateAvatar, setAvatarPreset } = require("../controllers/user.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/me", getProfile);
router.put("/me", updateProfile);
router.put("/me/avatar", upload.single("avatar"), updateAvatar);
router.put("/me/avatar-preset", setAvatarPreset);

module.exports = router;
