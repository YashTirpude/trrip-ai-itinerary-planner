const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const daySchema = new mongoose.Schema({
  day: Number,
  date: String,
  title: String,
  activities: [
    {
      time: String,
      description: String,
      location: String,
      type: { type: String, enum: ["flight", "hotel", "activity", "transport", "meal", "other"] },
    },
  ],
  notes: String,
});

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    startDate: String,
    endDate: String,
    travelerName: String,
    days: [daySchema],
    rawSummary: String,        // Full AI-generated markdown summary
    extractedData: Object,     // Raw extracted booking data
    uploadedFiles: [
      {
        originalName: String,
        filename: String,
        mimetype: String,
        size: Number,
        path: String,
      },
    ],
    shareToken: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
