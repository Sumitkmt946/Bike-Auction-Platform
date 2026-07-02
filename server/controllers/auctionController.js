const Auction = require('../models/Auction');
const Bike = require('../models/Bike');
const { scheduleAuctionEnd } = require('../utils/auctionScheduler');

/**
 * @desc    Get all auctions (supports ?status=active|upcoming|ended filter)
 * @route   GET /api/auctions
 * @access  Private
 */
const getAllAuctions = async (req, res, next) => {
  try {
    const filter = {};

    // Optional status filter from query string
    if (req.query.status && ['upcoming', 'active', 'ended'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const auctions = await Auction.find(filter)
      .populate('bike')
      .populate('highestBidder', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single auction by ID
 * @route   GET /api/auctions/:id
 * @access  Private
 */
const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('bike')
      .populate('highestBidder', 'name')
      .populate('winner', 'name email');

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new auction
 * @route   POST /api/auctions
 * @access  Private/Admin
 */
const createAuction = async (req, res, next) => {
  try {
    const { bike, startTime, endTime } = req.body;

    // Validate that the bike exists
    const bikeDoc = await Bike.findById(bike);
    if (!bikeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found',
      });
    }

    // Validate that endTime is after startTime
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time',
      });
    }

    // Create auction with highestBid initialized to the bike's starting price
    const auction = await Auction.create({
      bike,
      startTime,
      endTime,
      highestBid: bikeDoc.startingPrice,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an auction (only if status is 'upcoming')
 * @route   PUT /api/auctions/:id
 * @access  Private/Admin
 */
const updateAuction = async (req, res, next) => {
  try {
    let auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    if (auction.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Can only update auctions with status "upcoming"',
      });
    }

    // Validate endTime > startTime if either is being updated
    if (req.body.endTime || req.body.startTime) {
      const newStart = req.body.startTime ? new Date(req.body.startTime) : auction.startTime;
      const newEnd = req.body.endTime ? new Date(req.body.endTime) : auction.endTime;
      if (newEnd <= newStart) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time',
        });
      }
    }

    auction = await Auction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Auction updated successfully',
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an auction (only if status is not 'active')
 * @route   DELETE /api/auctions/:id
 * @access  Private/Admin
 */
const deleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    if (auction.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an active auction',
      });
    }

    await Auction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Auction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start an auction (set status to 'active' and schedule auto-end)
 * @route   PATCH /api/auctions/:id/start
 * @access  Private/Admin
 */
const startAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    if (auction.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: `Cannot start auction — current status is "${auction.status}"`,
      });
    }

    auction.status = 'active';
    await auction.save();

    // Schedule the auto-end timer
    const io = req.app.get('io');
    scheduleAuctionEnd(auction, io);

    // Emit 'auctionStarted' to the auction room
    if (io) {
      io.to(`auction_${auction._id}`).emit('auctionStarted', {
        auctionId: auction._id,
        message: 'Auction has started!',
        startTime: auction.startTime,
        endTime: auction.endTime,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Auction started successfully',
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    End an auction manually (set status to 'ended', declare winner)
 * @route   PATCH /api/auctions/:id/end
 * @access  Private/Admin
 */
const endAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    if (auction.status === 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Auction has already ended',
      });
    }

    auction.status = 'ended';
    auction.winner = auction.highestBidder || null;
    await auction.save();

    // Emit 'auctionEnded' to the auction room
    const io = req.app.get('io');
    if (io) {
      io.to(`auction_${auction._id}`).emit('auctionEnded', {
        auctionId: auction._id,
        winner: auction.winner,
        highestBid: auction.highestBid,
        message: 'Auction has ended!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Auction ended successfully',
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
  startAuction,
  endAuction,
};
