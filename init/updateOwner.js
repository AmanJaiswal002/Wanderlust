const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const updateDb = async () => {
    try {
        // 1. Check if user 'aman' exists, if not create him
        let aman = await User.findOne({ username: "aman" });
        if (!aman) {
            console.log("Creating user 'aman'...");
            const newUser = new User({ email: "aman@gmail.com", username: "aman" });
            aman = await User.register(newUser, "aman123");
            console.log("User 'aman' created successfully!");
        }

        // 2. Update all listings to be owned by 'aman'
        console.log("Updating listings owner to 'aman'...");
        await Listing.updateMany({}, { owner: aman._id });
        console.log("Successfully updated all listings!");
        
        process.exit();
    } catch (err) {
        console.log("Error during update:", err);
        process.exit();
    }
};

updateDb();
