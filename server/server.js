const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const plannerProfileRoutes = require("./routes/plannerProfileRoutes");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/planner-profile", plannerProfileRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/statistics", statisticsRoutes);


// Connect Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Travel Planner API is running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});