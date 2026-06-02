const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  isPlanner,
  isApprovedPlanner,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/package-image",
  protect,
  isPlanner,
  isApprovedPlanner,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/package-images/${req.file.filename}`,
    });
  }
);

router.post(
  "/package-images",
  protect,
  isPlanner,
  isApprovedPlanner,
  upload.array("images", 5),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map(
      (file) => `/uploads/package-images/${file.filename}`
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  }
);

module.exports = router;