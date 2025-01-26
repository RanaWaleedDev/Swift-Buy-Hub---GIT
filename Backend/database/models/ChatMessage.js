const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    ref: 'User', // Reference to the User model
    required: true
  },
  receiverId: {
    type: String,
    ref: 'User', // Reference to the User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  adId: {
    type: String, // Include adId field
    required: true
  },
  timestamp: {
    type: String, // Change type to String
    required: true,
    default: () => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true // Display time in 12-hour format
      };

      return new Date().toLocaleString("en-US", options); // Generate timestamp in desired format
    }
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
