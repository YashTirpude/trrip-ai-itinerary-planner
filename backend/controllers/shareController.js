const Itinerary = require("../models/Itinerary");

// GET /api/share/:token — public, no auth needed
exports.getShared = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      shareToken: req.params.token,
      isPublic: true,
    }).select("-extractedData -uploadedFiles");

    if (!itinerary) {
      return res.status(404).json({ success: false, message: "Shared itinerary not found or is private" });
    }

    res.json({ success: true, itinerary });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/share/:id/toggle — toggle public/private
exports.toggleVisibility = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: "Itinerary not found" });
    }

    itinerary.isPublic = !itinerary.isPublic;
    await itinerary.save();

    res.json({
      success: true,
      isPublic: itinerary.isPublic,
      shareToken: itinerary.shareToken,
    });
  } catch (err) {
    next(err);
  }
};
