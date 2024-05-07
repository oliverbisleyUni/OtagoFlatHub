var map = L.map('map').setView([-45.86101370, 170.51575930], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

document.addEventListener('DOMContentLoaded', function() {
    // Fetch flats data from the server
    fetch('/api/flats')
        .then(response => response.json())
        .then(flats => {
            flats.forEach(flat => {
                if(flat.latitude){
                    L.circle([flat.latitude, flat.longitude], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.8,
                        radius: 10
                    }).addTo(map).bindPopup(`<b>${flat.name}</b><br><a href="/flat/${flat.id}">View Details</a>`);
                }
            });
        })
        .catch(error => console.error('Error loading the flats data:', error));
});