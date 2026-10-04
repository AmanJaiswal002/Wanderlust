# 🌍 WanderLust - Nearby Destination Booking App

> 🌐 **Live Demo:** [https://wanderlust-qavh.onrender.com](https://wanderlust-qavh.onrender.com)

**WanderLust** is a high-performance, full-stack web application designed to help users discover, create, and review nearby travel destinations and accommodations. Inspired by platforms like Airbnb, it offers an intuitive UI and a secure, feature-rich experience.

## ✨ Key Features
- **User Authentication:** Secure signup and login using `Passport.js` with robust session management.
- **Listing Management:** Authenticated users can create, edit, and delete their travel destination listings.
- **Image Uploads:** Direct integration with **Cloudinary** via `Multer` for seamless image storage.
- **Interactive Maps:** Real-time geocoding utilizing the free **Nominatim (OpenStreetMap) API** (for backend processing) and **Mapbox** for rendering frontend maps.
- **Reviews & Ratings:** Users can leave detailed reviews and 1-5 star ratings for different locations.
- **Error Handling:** Centralized server side validation using `Joi` and custom wrap-around error handlers.
- **Flash Messages:** Instant user feedback and notifications using `connect-flash`.

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript, EJS (Embedded JavaScript templates), EJS-Mate.
- **Backend:** Node.js, API routing via Express.js.
- **Database:** MongoDB (via Mongoose), Connect-Mongo (for remote session storage).
- **Security & Validation:** Passport.js, Passport-Local-Mongoose, Joi schemas.
- **External Services:** Cloudinary (Image hosting), Mapbox & Nominatim (Geocoding & Maps).

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [Git](https://git-scm.com/) installed. You will also need a MongoDB Atlas account (or a local MongoDB instance), a Cloudinary account, and a Mapbox account.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd WanderLust
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys. 
*Note: Make sure to replace the placeholder values with your actual API keys!*
```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_public_token

ATLASDB_URL=your_mongodb_connection_string

SECRET=your_secret_key_for_sessions
```

### 4. Run the Server
Start the application by running:
```bash
node app.js
# Or if you use nodemon:
# npm run dev
```
The server should now be listening on port `8080` (or the port defined). Navigate to `http://localhost:8080` in your web browser.

## 📂 Project Structure
```text
WanderLust/
├── controllers/       # Core business logic (listings, reviews, users)
├── init/              # Scripts to initialize/seed the database initially
├── models/            # Mongoose schemas (Listing, Review, User)
├── public/            # Static assets (Custom CSS, Client-side JS, Images)
├── routes/            # Express routers mapping endpoints to controllers
├── utils/             # Helper classes (e.g., ExpressError)
├── views/             # EJS templates, layouts, and partial includes
├── .env               # Secrets and API Keys (Ignored by Git)
├── app.js             # Entry point of the Express application
├── cloudConfig.js     # Cloudinary setup and configuration
├── middleware.js      # Custom middlewares for auth and data validation
├── schema.js          # Joi schemas for server-side validation
└── package.json       # Project dependencies and npm scripts
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to modify and adapt the project to fit your needs.

---
*Built with ❤️ for wanderers looking for their next adventure!*
