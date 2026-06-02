const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activityTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },

    dayTitle: {
      type: String,
      required: true,
      trim: true,
    },

    activities: [activitySchema],
  },
  { _id: true }
);

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    startLocation: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Adventure",
        "Beach",
        "Family",
        "Couple",
        "Luxury",
        "Religious",
        "Nature",
        "Cultural",
        "Other",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },

    plannerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    bookingCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);