const Package = require("../models/Package");

// Create package - approved planner only
const createPackage = async (req, res) => {
  try {
    const {
      title,
      destination,
      startLocation,
      category,
      description,
      price,
      duration,
      totalSeats,
      availableSeats,
      images,
      itinerary,
      status,
      featured,
    } = req.body;

    const newPackage = await Package.create({
      title,
      destination,
      startLocation,
      category,
      description,
      price,
      duration,
      totalSeats,
      availableSeats,
      images: images || [],
      itinerary: itinerary || [],
      plannerId: req.user._id,
      status: status || "active",
      featured: featured || false,
    });

    res.status(201).json({
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Public - get all active packages
const getAllPackages = async (req, res) => {
  try {
    const {
      destination,
      category,
      startLocation,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      featured,
      search,
      sort,
    } = req.query;

    const filter = {
      status: "active",
    };

    if (destination) {
      filter.destination = { $regex: destination, $options: "i" };
    }

    if (startLocation) {
      filter.startLocation = { $regex: startLocation, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minDuration || maxDuration) {
      filter.duration = {};

      if (minDuration) filter.duration.$gte = Number(minDuration);
      if (maxDuration) filter.duration.$lte = Number(maxDuration);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { startLocation: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price-low") {
      sortOption = { price: 1 };
    }

    if (sort === "price-high") {
      sortOption = { price: -1 };
    }

    if (sort === "duration-low") {
      sortOption = { duration: 1 };
    }

    if (sort === "duration-high") {
      sortOption = { duration: -1 };
    }

    if (sort === "popular") {
      sortOption = { bookingCount: -1 };
    }

    const packages = await Package.find(filter)
      .populate("plannerId", "fullName organizationName email plannerStatus")
      .sort(sortOption);

    res.status(200).json({
      total: packages.length,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Planner - get own packages
const getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      plannerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Public - get single package
const getPackageById = async (req, res) => {
  try {
    const singlePackage = await Package.findById(req.params.id).populate(
      "plannerId",
      "fullName organizationName email plannerStatus"
    );

    if (!singlePackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    res.status(200).json(singlePackage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Planner - update own package only
const updatePackage = async (req, res) => {
  try {
    const singlePackage = await Package.findById(req.params.id);

    if (!singlePackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    if (singlePackage.plannerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own packages",
      });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Planner - delete own package only
const deletePackage = async (req, res) => {
  try {
    const singlePackage = await Package.findById(req.params.id);

    if (!singlePackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    if (singlePackage.plannerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own packages",
      });
    }

    await singlePackage.deleteOne();

    res.status(200).json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Public - get trending packages
const getTrendingPackages = async (req, res) => {
  try {
    const packages = await Package.find({ status: "active" })
      .populate("plannerId", "fullName organizationName email plannerStatus")
      .sort({ bookingCount: -1, createdAt: -1 })
      .limit(8);

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Public - get featured packages
const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      status: "active",
      featured: true,
    })
      .populate("plannerId", "fullName organizationName email plannerStatus")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getMyPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getTrendingPackages,
  getFeaturedPackages,
};