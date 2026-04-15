/**
 * fixCoordinates.js
 * Run once: node scripts/fixCoordinates.js
 * 
 * Finds all listings missing valid coordinates and
 * geocodes them using free Nominatim (OpenStreetMap).
 */

const mongoose = require('mongoose');
const https = require('https');
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Free geocoding using Nominatim
function geocodeLocation(query) {
    return new Promise((resolve) => {
        const encoded = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
        const options = { headers: { 'User-Agent': 'WanderLust-App/1.0' } };

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
                } catch (e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

// Small delay to avoid Nominatim rate limit (1 request/second)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixCoordinates() {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const listings = await Listing.find({});
    console.log(`📋 Total listings found: ${listings.length}`);

    let updated = 0;
    let failed = 0;
    let skipped = 0;

    for (const listing of listings) {
        // Check if already has valid non-fallback coordinates
        const hasCoords = (
            listing.geometry &&
            listing.geometry.coordinates &&
            listing.geometry.coordinates.length === 2
        );

        // Skip if already has valid coords (not New Delhi fallback)
        if (hasCoords) {
            const [lng, lat] = listing.geometry.coordinates;
            const isNewDelhi = (Math.abs(lng - 77.209) < 0.001 && Math.abs(lat - 28.6139) < 0.001);
            if (!isNewDelhi) {
                console.log(`⏭️  Skipping "${listing.title}" (already has coords)`);
                skipped++;
                continue;
            }
        }

        // Build location query
        const query = `${listing.location || ''}, ${listing.country || ''}`.trim();
        if (!query || query === ',') {
            console.log(`⚠️  Skipping "${listing.title}" — no location data`);
            failed++;
            continue;
        }

        console.log(`🔍 Geocoding: "${listing.title}" → "${query}"`);
        await delay(1100); // Nominatim rate limit: 1 req/sec

        const geometry = await geocodeLocation(query);
        if (geometry) {
            listing.geometry = geometry;
            await listing.save();
            console.log(`  ✅ Updated → [${geometry.coordinates[1].toFixed(4)}, ${geometry.coordinates[0].toFixed(4)}]`);
            updated++;
        } else {
            console.log(`  ❌ Could not geocode "${query}"`);
            failed++;
        }
    }

    console.log('\n🎉 Done!');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed:  ${failed}`);
    await mongoose.disconnect();
}

fixCoordinates().catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
});
