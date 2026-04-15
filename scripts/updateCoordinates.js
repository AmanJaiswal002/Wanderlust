const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config();

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(async () => {
    console.log("Connected to DB. Starting coordinate update...");
    const listings = await Listing.find({ 
        $or: [
            { "geometry.coordinates": { $size: 0 } },
            { geometry: { $exists: false } }
        ]
    });

    console.log(`Found ${listings.length} listings to update.`);

    for (let listing of listings) {
        if (listing.location) {
            console.log(`Geocoding location for: ${listing.title} (${listing.location})`);
            try {
                let response = await geocodingClient
                    .forwardGeocode({
                        query: listing.location,
                        limit: 1,
                    })
                    .send();

                if (response.body.features.length > 0) {
                    listing.geometry = response.body.features[0].geometry;
                    await listing.save();
                    console.log(`Updated coordinates for: ${listing.title}`);
                } else {
                    console.log(`No results found for: ${listing.location}`);
                }
            } catch (err) {
                console.error(`Error geocoding ${listing.title}:`, err.message);
            }
        }
    }
    console.log("Update complete. Exiting...");
    process.exit();
}).catch(err => {
    console.log(err);
    process.exit(1);
});
