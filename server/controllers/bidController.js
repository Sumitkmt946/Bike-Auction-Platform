const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

/**
 * @desc    Place a bid on an auction
 * @route   POST /api/auctions/:auctionId/bids
 * @access  Private
 */
const placeBid = async (req, res, next) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const bidderId = req.user.id;

    // Find the auction
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    // Check that the auction is active
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot bid — auction status is "${auction.status}"`,
      });
    }

    // Check that current time is within the auction window
    const now = new Date();
    if (now < auction.startTime || now > auction.endTime) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bid — auction is outside its active time window',
      });
    }

    // Check that the bid amount is higher than the current highest bid
    if (amount <= auction.highestBid) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than the current highest bid of ${auction.highestBid}`,
      });
    }

    // Create the bid document
    const bid = await Bid.create({
      auction: auctionId,
      bidder: bidderId,
      amount,
    });

    // Update the auction with the new highest bid
    auction.highestBid = amount;
    auction.highestBidder = bidderId;
    auction.totalBids += 1;
    await auction.save();

    // Populate bidder info for the response
    await bid.populate('bidder', 'name');

    // Emit 'newBid' event to the auction room via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`auction_${auctionId}`).emit('newBid', {
        auctionId,
        bid: {
          id: bid._id,
          amount: bid.amount,
          bidder: {
            id: bid.bidder._id,
            name: bid.bidder.name,
          },
          createdAt: bid.createdAt,
        },
        highestBid: auction.highestBid,
        totalBids: auction.totalBids,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bids for an auction (sorted by newest first)
 * @route   GET /api/auctions/:auctionId/bids
 * @access  Private
 */
const getAuctionBids = async (req, res, next) => {
  try {
    const { auctionId } = req.params;

    // Verify the auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    const bids = await Bid.find({ auction: auctionId })
      .populate('bidder', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeBid, getAuctionBids };
