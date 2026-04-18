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
    const tiltCards = document.querySelectorAll('[data-tilt-card]');

    tiltCards.forEach(card => {
        const panel = card.querySelector('.map-panel');
        const iframe = card.querySelector('iframe');
        if (!panel) return;

        card.addEventListener('mousemove', event => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 12;
            const rotateX = 18 - y * 10;

            panel.style.transform = `rotateX(${rotateX}deg) rotateZ(-8deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseenter', () => {
            if (iframe && window.innerWidth > 768) iframe.style.pointerEvents = 'none';
        });

        card.addEventListener('mouseleave', () => {
            panel.style.transform = '';
        });
    });
});
