const Listing = require("../models/listing");
const https = require('https');

// Free geocoding using Nominatim (OpenStreetMap) - no token required
function geocodeLocation(locationQuery) {
    return new Promise((resolve, reject) => {
        const query = encodeURIComponent(locationQuery);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
        const options = {
            headers: { 'User-Agent': 'WanderLust-App/1.0' }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const results = JSON.parse(data);
                    if (results && results.length > 0) {
                        const { lon, lat } = results[0];
                        resolve({ type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] });
                    } else {
                        resolve(null);
                    }
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); // New listings will appear at the bottom
    res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    } )
    .populate("owner");
    if(!listing) {
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Geocode the location using free Nominatim API
    const locationQuery = req.body.listing.location + ', ' + (req.body.listing.country || '');
    const geometry = await geocodeLocation(locationQuery);
    newListing.geometry = geometry || { type: 'Point', coordinates: [77.209, 28.6139] }; // Fallback to New Delhi

    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing) {
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_150,c_fill");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    // Geocode the updated location using free Nominatim API
    if(req.body.listing.location) {
        const locationQuery = req.body.listing.location + ', ' + (req.body.listing.country || listing.country || '');
        const geometry = await geocodeLocation(locationQuery);
        listing.geometry = geometry || { type: 'Point', coordinates: [77.209, 28.6139] };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}