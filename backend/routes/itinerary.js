const express = require("express");
const router = express.Router();
const {
  generate,
  getAll,
  getOne,
  deleteOne,
} = require("../controllers/itineraryController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { downloadPDF } = require("../controllers/downloadPdfController");

router.get("/:id/pdf", downloadPDF);
router.use(protect);

router.post("/generate", upload.array("documents", 10), generate);
router.get("/", getAll);
router.get("/:id", getOne);
router.delete("/:id", deleteOne);

module.exports = router;
