// Import necessary modules
const mongoose = require('mongoose');

// Define the schema for the data
const SmartInspectionSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
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

// Create the model
const SmartInspection = mongoose.model('SmartInspection', SmartInspectionSchema);

// Export the model
module.exports = SmartInspection;
