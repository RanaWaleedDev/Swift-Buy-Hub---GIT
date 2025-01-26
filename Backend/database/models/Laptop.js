// models/Laptop.js
const mongoose = require('mongoose');

// Custom function to format date and time
function formattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
  let hours = date.getHours(); // Get the hours
  const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? hours : 12; // Handle midnight
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Add leading zero if needed
  const seconds = date.getSeconds().toString().padStart(2, '0'); // Add leading zero if needed
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
}


const laptopSchema = new mongoose.Schema({
  selectedCategory:String,
  company: String,
  typeName: String,
  Ram: String,
  Weight: String,
  Touchscreen: String,
  Ips: String,
  ppi: String,
  Cpubrand: String,
  HDD: String,
  SSD: String,
  Gpubrand: String,
  os: String,
  description: String,
  location: String,
  images: [String], // Array to store image paths
  Inches: String,
  pixels: String,
  userId:String,
  timestamp: { type: String, default: formattedDate },
  price:String,

});

const Laptop = mongoose.model('Laptop', laptopSchema);

module.exports = Laptop;
