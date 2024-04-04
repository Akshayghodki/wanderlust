// exampleUsage.js

const mongoose = require("mongoose");
const Review = require("./review"); // Assuming the file is in the same directory

// Connect to MongoDB
mongoose.connect("mongodb://localhost/yourDatabaseName", { useNewUrlParser: true, useUnifiedTopology: true });

// Define a model that references the Review model
const YourModel = mongoose.model("YourModel", new mongoose.Schema({
    // Other fields in your model
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
}));

// Create a new review
const newReview = new Review({
    comment: "Great product!",
    rating: 5,
});

// Save the review
newReview.save()
    .then(savedReview => {
        // Create a document that references the saved review
        const yourModelInstance = new YourModel({
            // Other fields in your model
            reviews: [savedReview._id],
        });

        // Save the document
        return yourModelInstance.save();
    })
    .then(savedInstance => {
        // Populate the 'reviews' field with options.strict set to false
        return YourModel.findById(savedInstance._id).populate({
            path: 'reviews',
            options: { strict: false },
        }).exec();
    })
    .then(populatedData => {
        console.log("Populated Data:", populatedData);
    })
    .catch(error => {
        console.error("Error:", error);
    })
    .finally(() => {
        // Disconnect from MongoDB after execution
        mongoose.disconnect();
    });
