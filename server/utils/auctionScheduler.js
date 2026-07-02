const Auction = require('../models/Auction');
const logger = require('./logger');

// In-memory map of scheduled timers keyed by auction ID
const scheduledTimers = new Map();

/**
 * Schedule the automatic ending of an auction.
 * Sets a setTimeout that fires when auction.endTime arrives.
 * On trigger: marks the auction as 'ended', sets the winner, emits Socket.IO event.
 *
 * @param {Object} auction - The auction document.
 * @param {Object} io - The Socket.IO server instance.
 */
const scheduleAuctionEnd = (auction, io) => {
  const auctionId = auction._id.toString();
  const now = Date.now();
  const endTime = new Date(auction.endTime).getTime();
  const delay = endTime - now;

  // Clear any existing timer for this auction
  if (scheduledTimers.has(auctionId)) {
    clearTimeout(scheduledTimers.get(auctionId));
    scheduledTimers.delete(auctionId);
  }

  // If the end time has already passed, end it immediately
  if (delay <= 0) {
    endAuctionNow(auctionId, io);
    return;
  }

  logger.info(`Scheduled auction ${auctionId} to end in ${Math.round(delay / 1000)}s`);

  const timer = setTimeout(() => {
    endAuctionNow(auctionId, io);
    scheduledTimers.delete(auctionId);
  }, delay);

  scheduledTimers.set(auctionId, timer);
};

/**
 * Schedule the automatic starting of an upcoming auction.
 * Sets a setTimeout that fires when auction.startTime arrives.
 * On trigger: marks the auction as 'active', emits Socket.IO event, schedules end.
 *
 * @param {Object} auction - The auction document.
 * @param {Object} io - The Socket.IO server instance.
 */
const scheduleAuctionStart = (auction, io) => {
  const auctionId = auction._id.toString();
  const now = Date.now();
  const startTime = new Date(auction.startTime).getTime();
  const delay = startTime - now;

  if (delay <= 0) {
    // Start time already passed — start immediately
    startAuctionNow(auctionId, io);
    return;
  }

  logger.info(`Scheduled auction ${auctionId} to start in ${Math.round(delay / 1000)}s`);

  const startTimerKey = `start_${auctionId}`;

  const timer = setTimeout(() => {
    startAuctionNow(auctionId, io);
    scheduledTimers.delete(startTimerKey);
  }, delay);

  scheduledTimers.set(startTimerKey, timer);
};

/**
 * Immediately start an auction (used by timer callback).
 */
const startAuctionNow = async (auctionId, io) => {
  try {
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== 'upcoming') return;

    auction.status = 'active';
    await auction.save();

    logger.info(`Auction ${auctionId} auto-started`);

    if (io) {
      io.to(`auction_${auctionId}`).emit('auctionStarted', {
        auctionId,
        message: 'Auction has started!',
        startTime: auction.startTime,
        endTime: auction.endTime,
      });
    }

    // Now schedule the end
    scheduleAuctionEnd(auction, io);
  } catch (error) {
    logger.error(`Error auto-starting auction ${auctionId}: ${error.message}`);
  }
};

/**
 * Immediately end an auction (used by timer callback).
 */
const endAuctionNow = async (auctionId, io) => {
  try {
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status === 'ended') return;

    auction.status = 'ended';
    auction.winner = auction.highestBidder || null;
    await auction.save();

    logger.info(`Auction ${auctionId} ended. Winner: ${auction.winner || 'No bids'}`);

    if (io) {
      io.to(`auction_${auctionId}`).emit('auctionEnded', {
        auctionId,
        winner: auction.winner,
        highestBid: auction.highestBid,
        message: 'Auction has ended!',
      });
    }
  } catch (error) {
    logger.error(`Error ending auction ${auctionId}: ${error.message}`);
  }
};

/**
 * On server start, find all 'active' and 'upcoming' auctions and schedule them.
 * - Active auctions: schedule their end.
 * - Upcoming auctions: schedule their start (which will then schedule their end).
 *
 * @param {Object} io - The Socket.IO server instance.
 */
const scheduleExistingAuctions = async (io) => {
  try {
    const activeAuctions = await Auction.find({ status: 'active' });
    const upcomingAuctions = await Auction.find({ status: 'upcoming' });

    logger.info(
      `Scheduling ${activeAuctions.length} active and ${upcomingAuctions.length} upcoming auctions`
    );

    // Schedule end for all active auctions
    for (const auction of activeAuctions) {
      scheduleAuctionEnd(auction, io);
    }

    // Schedule start for all upcoming auctions
    for (const auction of upcomingAuctions) {
      scheduleAuctionStart(auction, io);
    }
  } catch (error) {
    logger.error(`Error scheduling existing auctions: ${error.message}`);
  }
};

module.exports = {
  scheduleAuctionEnd,
  scheduleAuctionStart,
  scheduleExistingAuctions,
};
