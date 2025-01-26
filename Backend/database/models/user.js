const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    e_mail: {
        type: String,
        trim: true,
        minlength: 3,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    contact: {
        type: String,
        trim: true,
        minlength: 10,
        // required: true
    },
    role: {
        type: String,
        trim: true,
        minlength: 3,
        default: 'user', // Set default value to 'user'
    },
    profilepic: {
        type: String,
        default: '', // Set default value to an empty string
    },
    createdAt: {
        type: Date,
        default: Date.now // Set default value to current date/time
    },
    status: {
        type: String,
        default: 'Active' // Set default value to 'Active'
    }
});

// Define a virtual property for formatted createdAt
userSchema.virtual('formattedCreatedAt').get(function () {
    // Format the createdAt date as "YYYY-MM-DD" (e.g., "2024-03-28")
    const year = this.createdAt.getFullYear();
    const month = String(this.createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(this.createdAt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

const User = mongoose.model('user', userSchema);

module.exports = User;
