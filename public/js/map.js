// Use Leaflet.js with OpenStreetMap (free, no token required)
// Default center: New Delhi fallback
var defaultLat = 28.6139;
var defaultLng = 77.2090;

// Check if listing has valid coordinates
var hasCoords = (
    listing &&
    listing.geometry &&
    listing.geometry.coordinates &&
    listing.geometry.coordinates.length === 2
);

// Leaflet uses [lat, lng], but GeoJSON stores [lng, lat]
var lat = hasCoords ? listing.geometry.coordinates[1] : defaultLat;
var lng = hasCoords ? listing.geometry.coordinates[0] : defaultLng;

// Initialize the Leaflet map
var map = L.map('map').setView([lat, lng], 10);

// Add OpenStreetMap tile layer (completely free, no token)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map);

// Custom red location pin icon (Google Maps style)
var redIcon = L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="16" height="24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
              fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    iconSize: [16, 24],
    iconAnchor: [8, 24],
    popupAnchor: [0, -24]
});

// Add a red marker at the listing location
var marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);

// Add popup to the marker
marker.bindPopup(
    "<b>" + (listing.title || "Listing") + "</b><br>Exact location provided after booking."
).openPopup();
