const Itinerary = require("../models/Itinerary");
const generatePDF = require("../utils/pdfGenerator");
const { extractBookingData, generateItinerary } = require("../utils/aiService");
const fs = require("fs");

// POST /api/itineraries/generate
exports.generate = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const files = req.files;

    // Step 1: Extract booking data
    let extractedData;
    try {
      extractedData = await extractBookingData(files);
    } catch (err) {
      console.error("Extraction error:", err);
      return res.status(422).json({
        success: false,
        message:
          "Could not extract booking data from documents. Please ensure they are valid travel documents.",
      });
    }

    // Step 2: Generate itinerary
    let itineraryData;
    try {
      itineraryData = await generateItinerary(extractedData);
    } catch (err) {
      console.error("Generation error:", err);
      return res.status(422).json({
        success: false,
        message: "Could not generate itinerary. Please try again.",
      });
    }

    // Step 3: Save to DB
    const uploadedFiles = files.map((f) => ({
      originalName: f.originalname,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
    }));

    const itinerary = await Itinerary.create({
      user: req.user._id,
      title: itineraryData.title,
      destination: itineraryData.destination,
      startDate: itineraryData.startDate,
      endDate: itineraryData.endDate,
      travelerName: itineraryData.travelerName,
      days: itineraryData.days,
      rawSummary: itineraryData.rawSummary,
      extractedData,
      uploadedFiles,
    });

    const pdfBuffer = await generatePDF(itinerary);

    itinerary.pdfData = pdfBuffer;
    itinerary.pdfContentType = "application/pdf";

    await itinerary.save();

    res.status(201).json({ success: true, itinerary });
  } catch (err) {
    next(err);
  }
};

// GET /api/itineraries — user's history
exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [itineraries, total] = await Promise.all([
      Itinerary.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-extractedData -uploadedFiles"),
      Itinerary.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      itineraries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/itineraries/:id
exports.getOne = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res
        .status(404)
        .json({ success: false, message: "Itinerary not found" });
    }

    res.json({ success: true, itinerary });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/itineraries/:id
exports.deleteOne = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res
        .status(404)
        .json({ success: false, message: "Itinerary not found" });
    }

    // Delete uploaded files from disk
    itinerary.uploadedFiles.forEach((f) => {
      if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
    });

    await itinerary.deleteOne();
    res.json({ success: true, message: "Itinerary deleted" });
  } catch (err) {
    next(err);
  }
};
