var MapWrapper = function(container, center, zoomLevel){
    this.googleMap = new google.maps.Map(container, {
        center: center,
        zoom: zoomLevel
    });
    this.markers = [];
};

MapWrapper.prototype.addMarker = function(coords, map){
    var marker = new google.maps.Marker({
        position: coords,
        map: this.googleMap
    });

    marker.addListener('click', this.handleMarkerClick);
    this.markers.push(marker);
}

MapWrapper.prototype.addClickEvent = function(){
    google.maps.event.addListener(this.googleMap, 'click', function(event){
        console.log(event.latLng.lng());
        console.log(event.latLng.lat());

        var coords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        this.addMarker(coords, this.googleMap);
    }.bind(this));
};

MapWrapper.prototype.bounceMarkers = function(){
    this.markers.forEach(function(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
};

MapWrapper.prototype.handleMarkerClick = function(){
    var url = 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=' + this.position.lat() + '|' + this.position.lng() + '&gsradius=10000&gslimit=10&format=json&origin=*';

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var responseText = xhr.responseText;
        var jsonText = JSON.parse(responseText);
        var title = jsonText.query.geosearch[0].title;

        var distance = jsonText.query.geosearch[0].dist;

        var infoWindow = new google.maps.InfoWindow({
          content: title + " " + distance + "m"
        });
        infoWindow.open(this.googleMap, this);
        
    }.bind(this);

    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };

    xhr.send();
};

MapWrapper.prototype.setCenter = function(coords){
    this.googleMap.setCenter(coords);
};



// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}