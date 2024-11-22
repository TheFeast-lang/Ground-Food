class LeafletMap {
    constructor(containerId, center, zoom) {
      this.map = L.map(containerId, {
        center: center,
        zoom: zoom,
        dragging: true, 
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false, 
        touchZoom: false, 
        tap: false 
      });
      this.initTileLayer();
    }
  
    initTileLayer() {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }
  
    addMarker(lat, lng, message, imageUrl, id) {
      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(message);
  
      marker.on('click', () => {
        marker.bindPopup(`<img src="${imageUrl}" alt="${message}" style="width: 100px; height: auto;" />`);
        marker.openPopup();
      });
    }
  
    loadMarkersFromJson(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          data.garbageData.forEach(item => {
            this.addMarker(
              item.location.lat, 
              item.location.lng, 
              item.name, 
              item.image, 
              item.id
            );
          });
        })
        .catch(error => console.error('Error loading markers:', error));
    }
  }
  
  const myMap = new LeafletMap('map', [8.360004, 124.868419], 18);
  myMap.loadMarkersFromJson('app.json');
  