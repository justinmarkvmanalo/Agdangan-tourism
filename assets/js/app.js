// Initial Mock Data
const initialResorts = [
    { id: 1, name: "Emerald Cove Eco-Resort", type: "Resort", price: 2500, rating: 4.8, location: "Coastal" },
    { id: 2, name: "Green Valley Farm Stay", type: "Farm", price: 1800, rating: 4.5, location: "Inland" },
    { id: 3, name: "Azure Beach Cottages", type: "Beach", price: 3200, rating: 4.9, location: "Coastal" }
];

const initialTours = [
    { id: 1, name: "Mangrove Boat Tour", guide: "Kuya Ben", price: 500, availability: "Daily" },
    { id: 2, name: "Mt. Agdangan Hiking", guide: "Mang Juan", price: 800, availability: "Weekends" }
];

const initialProducts = [
    { id: 1, name: "Virgin Coconut Oil (500ml)", price: 350, stock: 45 },
    { id: 2, name: "Local Coco-Sweets Pack", price: 120, stock: 100 },
    { id: 3, name: "Handwoven Pandan Bags", price: 850, stock: 12 }
];

// Initialize LocalStorage
function initData() {
    if (!localStorage.getItem('agd_resorts')) localStorage.setItem('agd_resorts', JSON.stringify(initialResorts));
    if (!localStorage.getItem('agd_tours')) localStorage.setItem('agd_tours', JSON.stringify(initialTours));
    if (!localStorage.getItem('agd_products')) localStorage.setItem('agd_products', JSON.stringify(initialProducts));
    if (!localStorage.getItem('agd_bookings')) localStorage.setItem('agd_bookings', JSON.stringify([]));
    if (!localStorage.getItem('agd_orders')) localStorage.setItem('agd_orders', JSON.stringify([]));
}

initData();

// Utility function to get data
function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Global UI Helper: Booking Submission
function submitBooking(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const booking = {
        id: Date.now(),
        item: formData.get('itemName'),
        date: formData.get('date'),
        guests: formData.get('guests'),
        customer: formData.get('customerName'),
        status: 'Pending'
    };

    const bookings = getData('agd_bookings');
    bookings.push(booking);
    localStorage.setItem('agd_bookings', JSON.stringify(bookings));

    alert("Booking submitted successfully!");
    event.target.reset();
}

// Global UI Helper: Order Submission
function submitOrder(productId, productName) {
    const customer = prompt("Enter your name to complete the order:");
    if (!customer) return;

    const orders = getData('agd_orders');
    const order = {
        id: Date.now(),
        product: productName,
        customer: customer,
        date: new Date().toLocaleDateString(),
        status: 'Confirmed'
    };

    orders.push(order);
    localStorage.setItem('agd_orders', JSON.stringify(orders));

    // Reduce stock
    const products = getData('agd_products');
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        product.stock--;
        localStorage.setItem('agd_products', JSON.stringify(products));
    }

    alert(`Order for ${productName} confirmed!`);
    location.reload(); // Refresh to show new stock level
}

document.addEventListener('DOMContentLoaded', () => {
    initAgdanganMap();
});

function initAgdanganMap() {
    const mapElement = document.getElementById('agdangan-map');
    if (!mapElement || typeof L === 'undefined') return;

    const infoCard = document.getElementById('map-info-card');
    const zoneButtons = document.querySelectorAll('[data-map-focus]');
    const resortButtons = document.querySelectorAll('[data-map-resort]');
    const markerIcon = L.divIcon({
        className: '',
        html: '<div class="custom-map-marker"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });
    const resortIcon = L.divIcon({
        className: '',
        html: '<div class="custom-map-marker resort-marker"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    const map = L.map(mapElement, {
        zoomControl: true,
        scrollWheelZoom: true,
        tap: true
    }).setView([13.8785, 121.9155], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const areas = {
        'municipal-center': {
            title: 'Municipal Center',
            description: 'The town proper and nearby service area where visitors can orient themselves before heading to resorts and local stops.',
            bounds: [[13.8758, 121.9108], [13.8818, 121.9198]],
            marker: [13.8788, 121.9151],
            color: '#0f9d58'
        },
        'coastal-belt': {
            title: 'Coastal Belt',
            description: 'A visitor-facing shoreline zone for beach access, scenic stops, and blue-water tourism activity.',
            bounds: [[13.8732, 121.9188], [13.8838, 121.9308]],
            marker: [13.8782, 121.9248],
            color: '#0288d1'
        },
        'farm-zone': {
            title: 'Farm Zone',
            description: 'An inland green belt suited to eco-farm visits, local produce stops, and agri-tourism storytelling.',
            bounds: [[13.8708, 121.9018], [13.8818, 121.9132]],
            marker: [13.8753, 121.9075],
            color: '#7cb342'
        },
        'gateway-route': {
            title: 'Gateway Route',
            description: 'The main approach corridor used to enter Agdangan and connect visitors to the center and coast.',
            bounds: [[13.8822, 121.9062], [13.8908, 121.9192]],
            marker: [13.887, 121.9123],
            color: '#fb8c00'
        }
    };

    const resorts = {
        'acesor-beach': {
            title: 'Acesor Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8789, 121.9287]
        },
        'christal-beach': {
            title: 'Christal Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8781, 121.9268]
        },
        'javierama-beach': {
            title: 'Javierama Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8773, 121.9254]
        },
        'joerich-beach': {
            title: 'Joerich Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8766, 121.9242]
        },
        'la-cereza': {
            title: 'La Cereza Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8796, 121.9232]
        },
        'montecarlo-beach': {
            title: 'Montecarlo Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8759, 121.9227]
        },
        'playa-de-nubla': {
            title: 'Playa de Nubla Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8802, 121.9218]
        },
        'pobeda-beach': {
            title: 'Pobeda Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8778, 121.9208]
        },
        'salvatierra-beach': {
            title: 'Salvatierra Beach Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate within the Agdangan coastal resort strip.',
            coords: [13.8768, 121.9198]
        },
        'yellow-house': {
            title: 'The Yellow House Resort',
            description: 'Listed on the Municipality of Agdangan tourism page. Marker position is approximate near the town approach and resort corridor.',
            coords: [13.8812, 121.9166]
        }
    };

    const activeLayers = {};
    const resortLayers = {};

    Object.entries(areas).forEach(([key, area]) => {
        const rectangle = L.rectangle(area.bounds, {
            color: area.color,
            weight: 2,
            fillColor: area.color,
            fillOpacity: 0.18
        }).addTo(map);

        const marker = L.marker(area.marker, { icon: markerIcon })
            .addTo(map)
            .bindPopup(
                `<div class="tourism-popup-card"><strong>${area.title}</strong><span>${area.description}</span></div>`,
                { className: 'tourism-popup' }
            );

        rectangle.on('click', () => focusArea(key));
        marker.on('click', () => focusArea(key));
        activeLayers[key] = { rectangle, marker };
    });

    Object.entries(resorts).forEach(([key, resort]) => {
        const marker = L.marker(resort.coords, { icon: resortIcon })
            .addTo(map)
            .bindPopup(
                `<div class="tourism-popup-card"><strong>${resort.title}</strong><span>${resort.description}</span></div>`,
                { className: 'tourism-popup' }
            );

        marker.on('click', () => focusResort(key));
        resortLayers[key] = marker;
    });

    function focusArea(key) {
        const area = areas[key];
        if (!area) return;

        map.fitBounds(area.bounds, {
            padding: [32, 32],
            maxZoom: 16
        });

        if (infoCard) {
            infoCard.innerHTML = `<h3>${area.title}</h3><p>${area.description}</p>`;
        }

        zoneButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.mapFocus === key);
        });

        resortButtons.forEach(button => {
            button.classList.remove('active');
        });

        activeLayers[key].marker.openPopup();
    }

    function focusResort(key) {
        const resort = resorts[key];
        if (!resort) return;

        map.setView(resort.coords, 16, { animate: true });

        if (infoCard) {
            infoCard.innerHTML = `<h3>${resort.title}</h3><p>${resort.description}</p>`;
        }

        zoneButtons.forEach(button => {
            button.classList.remove('active');
        });

        resortButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.mapResort === key);
        });

        resortLayers[key].openPopup();
    }

    zoneButtons.forEach(button => {
        button.addEventListener('click', () => {
            focusArea(button.dataset.mapFocus);
        });
    });

    resortButtons.forEach(button => {
        button.addEventListener('click', () => {
            focusResort(button.dataset.mapResort);
        });
    });

    focusResort('acesor-beach');
}
