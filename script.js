class LeafletMap {

  constructor(containerId, center, zoom) {
      this.map = L.map(containerId).setView(center, zoom);
      this.initTileLayer();
  }

  initTileLayer() {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
  }

  addMarker(lat, lng, message) {
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(message);
  }

  loadMarkersFromJson(url) {
      fetch(url)
          .then(response => response.json())
          .then(data => {
              data.forEach(marker => {
                  this.addMarker(marker.latitude, marker.longitude, marker.message);
              });
          })
          .catch(error => console.error('Error loading markers:', error));
  }
}

const myMap = new LeafletMap('map', [8.3600043, 124.8655281], 17);

/*
myMap.addMarker (8.4003566, 124.8780386, 'My home');
*/

myMap.addMarker(8.359836, 124.869316, 'Garden 1');
myMap.addMarker(8.359640, 124.869255, 'Garden 2');
myMap.addMarker(8.360063, 124.869374, 'Garden 3');
myMap.addMarker( 8.360272, 124.869434, 'Garden 4');