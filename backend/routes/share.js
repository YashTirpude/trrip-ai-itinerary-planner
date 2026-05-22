const express = require("express");
const router = express.Router();
const { getShared, toggleVisibility } = require("../controllers/shareController");
const { protect } = require("../middleware/auth");

router.get("/:token", getShared);
router.patch("/:id/toggle", protect, toggleVisibility);

module.exports = router;
