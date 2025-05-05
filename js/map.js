// Initialize the main travel map
function initTravelMap() {
    // Create the map centered on Sri Lanka
    const map = L.map('travel-map').setView([7.8731, 80.7718], 7);
    
    // Base map layers
    const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    });
    
    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    });
    
    const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17
    });
    
    // Add default base layer
    streetMap.addTo(map);
    
    // Create layer groups for different types of locations
    const citiesLayer = L.layerGroup();
    const natureLayer = L.layerGroup();
    const landmarksLayer = L.layerGroup();
    
    // Define custom icons
    const cityIcon = L.icon({
        iconUrl: 'images/map-pin.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    const natureIcon = L.icon({
        iconUrl: 'images/map-pin.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        className: 'nature-pin'
    });
    
    const landmarkIcon = L.icon({
        iconUrl: 'images/map-pin.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        className: 'landmark-pin'
    });
    
    // Sri Lanka locations data
    const locations = [
        {
            name: "Colombo",
            coords: [6.9271, 79.8612],
            type: "city",
            description: "Sri Lanka's vibrant commercial capital with colonial architecture and bustling markets.",
            image: "images/colombo.jpg"
        },
        {
            name: "Kandy",
            coords: [7.2906, 80.6337],
            type: "city",
            description: "Cultural capital and home to the sacred Temple of the Tooth.",
            image: "images/kandy.jpg"
        },
        {
            name: "Galle",
            coords: [6.0535, 80.2210],
            type: "city",
            description: "Historic coastal city with a well-preserved Dutch fort.",
            image: "images/galle.jpg"
        },
        {
            name: "Sigiriya",
            coords: [7.9570, 80.7603],
            type: "nature",
            description: "Ancient rock fortress known as the 'Eighth Wonder of the World'.",
            image: "images/sigiriya.jpg"
        },
        {
            name: "Yala National Park",
            coords: [6.3729, 81.5158],
            type: "nature",
            description: "Famous for its leopard population and diverse wildlife.",
            image: "images/yala.jpg"
        },
        {
            name: "Temple of the Tooth",
            coords: [7.2936, 80.6413],
            type: "landmark",
            description: "Sacred Buddhist temple housing the relic of the tooth of Buddha.",
            image: "images/landmarks/temple-of-tooth.jpg"
        },
        {
            name: "Sigiriya Rock Fortress",
            coords: [7.9570, 80.7603],
            type: "landmark",
            description: "Ancient rock fortress with stunning frescoes and lion's paw entrance.",
            image: "images/landmarks/sigiriya-rock.jpg"
        },
        {
            name: "Adam's Peak",
            coords: [6.8096, 80.4994],
            type: "nature",
            description: "Sacred mountain with the 'Sri Pada' footprint revered by multiple religions.",
            image: "images/adams-peak.jpg"
        },
        {
            name: "Nuwara Eliya",
            coords: [6.9497, 80.7891],
            type: "city",
            description: "Picturesque hill station known as 'Little England' with tea plantations.",
            image: "images/nuwara-eliya.jpg"
        },
        {
            name: "Anuradhapura",
            coords: [8.3356, 80.3889],
            type: "landmark",
            description: "Ancient capital with well-preserved ruins of an ancient Sinhalese civilization.",
            image: "images/anuradhapura.jpg"
        }
    ];
    
    // Add markers to the map
    locations.forEach(location => {
        let marker;
        
        switch(location.type) {
            case 'city':
                marker = L.marker(location.coords, { icon: cityIcon })
                    .bindPopup(createPopupContent(location))
                    .addTo(citiesLayer);
                break;
            case 'nature':
                marker = L.marker(location.coords, { icon: natureIcon })
                    .bindPopup(createPopupContent(location))
                    .addTo(natureLayer);
                break;
            case 'landmark':
                marker = L.marker(location.coords, { icon: landmarkIcon })
                    .bindPopup(createPopupContent(location))
                    .addTo(landmarksLayer);
                break;
        }
        
        // Add click event to play appropriate sound
        marker.on('click', function() {
            playSoundForLocation(location.type);
        });
    });
    
    // Add layers to the map
    citiesLayer.addTo(map);
    natureLayer.addTo(map);
    landmarksLayer.addTo(map);
    
    // Create layer control
    const baseLayers = {
        "Street Map": streetMap,
        "Satellite Map": satelliteMap,
        "Terrain Map": terrainMap
    };
    
    const overlays = {
        "Cities": citiesLayer,
        "Nature": natureLayer,
        "Landmarks": landmarksLayer
    };
    
    L.control.layers(baseLayers, overlays, {
        collapsed: false
    }).addTo(map);
    
    // Map type selector functionality
    const mapTypeSelector = document.getElementById('map-type');
    mapTypeSelector.addEventListener('change', function() {
        switch(this.value) {
            case 'streets':
                map.removeLayer(satelliteMap);
                map.removeLayer(terrainMap);
                streetMap.addTo(map);
                break;
            case 'satellite':
                map.removeLayer(streetMap);
                map.removeLayer(terrainMap);
                satelliteMap.addTo(map);
                break;
            case 'terrain':
                map.removeLayer(streetMap);
                map.removeLayer(satelliteMap);
                terrainMap.addTo(map);
                break;
        }
    });
    
    // Function to create popup content
    function createPopupContent(location) {
        return `
            <div class="map-popup">
                <h4>${location.name}</h4>
                <img src="${location.image}" alt="${location.name}" class="img-fluid mb-2">
                <p>${location.description}</p>
                <button class="btn btn-sm btn-primary view-details-btn" 
                        data-location='${JSON.stringify(location)}'>
                    View Details
                </button>
            </div>
        `;
    }
    
    // Handle popup button clicks
    map.on('popupopen', function() {
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const location = JSON.parse(this.getAttribute('data-location'));
                showLocationDetails(location);
            });
        });
    });
    
    // Function to play sound based on location type
    function playSoundForLocation(type) {
        const citySound = document.getElementById('city-sound');
        const templeSound = document.getElementById('temple-sound');
        const natureSound = document.getElementById('nature-sound');
        const marketSound = document.getElementById('market-sound');
        
        // Stop all sounds
        [citySound, templeSound, natureSound, marketSound].forEach(sound => sound.pause());
        
        // Play appropriate sound
        switch(type) {
            case 'city':
                citySound.currentTime = 0;
                citySound.play();
                break;
            case 'landmark':
                templeSound.currentTime = 0;
                templeSound.play();
                break;
            case 'nature':
                natureSound.currentTime = 0;
                natureSound.play();
                break;
        }
    }
}

// Initialize mini map for modal
function initMiniMap(elementId, coords, title) {
    const miniMap = L.map(elementId).setView(coords, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(miniMap);
    
    L.marker(coords).addTo(miniMap)
        .bindPopup(title)
        .openPopup();
    
    // Return the map instance in case we need to reference it later
    return miniMap;
}

// Show location details (used when clicking "View Details" in popup)
function showLocationDetails(location) {
    // Create a modal or use your existing modal to show details
    console.log("Showing details for:", location.name);
    // You can implement this similarly to the landmark modal functionality
}

// CSS for map pins (added dynamically)
const style = document.createElement('style');
style.textContent = `
    .nature-pin {
        filter: hue-rotate(90deg) brightness(1.2);
    }
    .landmark-pin {
        filter: hue-rotate(300deg) brightness(1.1);
    }
    .map-popup {
        max-width: 250px;
    }
    .map-popup img {
        border-radius: 5px;
        margin-bottom: 5px;
    }
    .view-details-btn {
        width: 100%;
    }
`;
document.head.appendChild(style);