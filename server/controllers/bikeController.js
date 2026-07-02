const Bike = require('../models/Bike');
const Auction = require('../models/Auction');

/**
 * @desc    Get all bikes
 * @route   GET /api/bikes
 * @access  Private
 */
const getAllBikes = async (req, res, next) => {
  try {
    const bikes = await Bike.find().populate('createdBy', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bikes.length,
      data: bikes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single bike by ID
 * @route   GET /api/bikes/:id
 * @access  Private
 */
const getBikeById = async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id).populate('createdBy', 'name email');

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bike,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new bike listing
 * @route   POST /api/bikes
 * @access  Private/Admin
 */
const createBike = async (req, res, next) => {
  try {
    // Attach the authenticated user as the creator
    req.body.createdBy = req.user.id;

    const bike = await Bike.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Bike created successfully',
      data: bike,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a bike listing
 * @route   PUT /api/bikes/:id
 * @access  Private/Admin
 */
const updateBike = async (req, res, next) => {
  try {
    const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bike updated successfully',
      data: bike,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a bike listing
 * @route   DELETE /api/bikes/:id
 * @access  Private/Admin
 */
const deleteBike = async (req, res, next) => {
  try {
    // Check if there is an active auction referencing this bike
    const activeAuction = await Auction.findOne({
      bike: req.params.id,
      status: 'active',
    });

    if (activeAuction) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete bike — it has an active auction',
      });
    }

    const bike = await Bike.findByIdAndDelete(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bike deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
};
