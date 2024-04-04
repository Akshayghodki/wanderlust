const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error fetching listings");
    res.redirect("/listings");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error fetching the listing");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    let category = req.body.listing.category;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing is created!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error creating the listing");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  } catch (err) {
    console.error(err);
    req.flash("error", "Error fetching the listing for editing");
    res.redirect("/listings");
  }
};

module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename };
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Error updating the listing");
    res.redirect("/listings");
  }
};

module.exports.destroyListing = async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error deleting the listing");
    res.redirect("/listings");
  }
};










// const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   };

//   module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
//   }

//   module.exports.showListing = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id)
//     .populate({
//       path: "reviews",
//       populate: {
//         path: "author",
//       },
//       }).populate("owner");
//     if(!listing){
//       req.flash("error","Listing you requested for does not exist!");
//       res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing });
//   };

//   module.exports.createListing= async(req, res,next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     console.log(url, "..", filename);
//     const newListing = new Listing(req.body.listing);
//     newListing.owner =req.user._id;
//     newListing.image = {url, filename};
//   await newListing.save();
//   req.flash("success", "New Listing is created!");
//   res.redirect("/listings");
  
// };

// module.exports.renderEditForm = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//       req.flash("error","Listing you requested for does not exist!");
//       res.redirect("/listings");
//     }
//     res.render("listings/edit.ejs", { listing });
//   };

//   module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
//   };

//   module.exports.destroyListing = async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing is Deleted!");
//     res.redirect("/listings");
//   };