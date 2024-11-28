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
      this.markers = [];
      this.lastSelectedMarker = null;
    }
  
    initTileLayer() {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }
  
    addMarker(lat, lng, name, imageUrl, id, htmlLink) {
      const marker = L.marker([lat, lng]).addTo(this.map);
  
      marker.on('click', () => {
        marker.bindPopup(`
          <img src="${imageUrl}" alt="${name}" style="width: 100px; height: auto;" />
        `).openPopup();
      });
  
      marker.on('dblclick', () => {
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `
          <p>Details for ${name}:</p>
          <p>ID: ${id}</p>
          <img src="${imageUrl}" alt="${name}" style="width: 150px; height: auto; display: block; margin-top: 5px;">
          <div style="text-align: center; margin-top: 10px;">
            <button onclick="window.location.href='${htmlLink}'" class="btn btn-primary more-details-btn">More Details</button>
          </div>
        `;
        marker.bindPopup(infoDiv).openPopup();
      });
  
      this.markers.push({ lat, lng, name, marker });
      return marker;
    }
  
    changeMarkerColor(marker, color) {
      const markerElement = marker.getElement();
      markerElement.classList.remove('marker-red', 'marker-blue', 'marker-green');
      markerElement.classList.add(`marker-${color}`);
      marker.openPopup();
    }
  
    resetMarkerColor() {
      if (this.lastSelectedMarker) {
        const lastMarkerElement = this.lastSelectedMarker.getElement();
        lastMarkerElement.classList.remove('marker-red', 'marker-blue', 'marker-green');
        lastMarkerElement.classList.add('marker-default');
      }
    }
  
    openPopup(lat, lng, color = 'red') {
      const marker = this.markers.find((m) => m.lat === lat && m.lng === lng);
      if (marker) {
        this.map.panTo([lat, lng]);
        this.resetMarkerColor();
        this.changeMarkerColor(marker.marker, color);
        this.lastSelectedMarker = marker.marker;
        marker.marker.openPopup();
      }
    }
  
    loadMarkersFromJson(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          data.garbageData.forEach((item) => {
            this.addMarker(
              item.location.lat, 
              item.location.lng, 
              item.name, 
              item.image, 
              item.id, 
              item.htmlLink
            );
          });
        })
        .catch((error) => console.error('Error loading markers:', error));
    }
  }
  
  const myMap = new LeafletMap('map', [8.360004, 124.868419], 18);
  myMap.loadMarkersFromJson('app.json');
  