const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  subscriptionType: {
    type: String,
    required: true
  },
  subscriptionTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'active'
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
