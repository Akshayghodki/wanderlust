
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error; // Rethrow the error to ensure the program exits on failure
  }
}

async function initializeDatabase() {
  try {
    // Update the image objects to use only the 'url' property
    const updatedData = initData.data.map((item) => ({
      ...item,
      image: item.image.url,
    }));

    await Listing.deleteMany({});
    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error; // Rethrow the error to ensure the program exits on failure
  }
}

async function main() {
  await connectToDatabase();
  initData.data = initData.data.map((obj) => ({...obj, owner:"65b55bf0b72d0dd6eab0ecff",
   }));
  await initializeDatabase();
  mongoose.disconnect(); // Close the database connection after initialization
}

main()
  .then(() => {
    console.log("Process completed successfully");
    process.exit(0); // Exit with success code
  })
  .catch((err) => {
    console.error("Process failed:", err.message);
    process.exit(1); // Exit with error code
  });







  // const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj) => ({...obj, owner:"65b55bf0b72d0dd6eab0ecff",
// }));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();








