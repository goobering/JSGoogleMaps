var initialize = function(){
    var mapDiv = document.querySelector('#main-map');
    var center = {lat: 55.857103, lng: -4.243951};
    var zoom = 18;
    var mainMap = new MapWrapper(mapDiv, center, zoom);
    mainMap.addMarker(center);
    mainMap.addClickEvent();

    var bounceButton = document.querySelector('#bounce-button');
    bounceButton.addEventListener('click', mainMap.bounceMarkers.bind(mainMap));

    var goToButton = document.querySelector('#go-to-button');
    goToButton.addEventListener('click', function(){
        handleGoToButtonClick(mainMap);
    });
};

var handleGoToButtonClick = function(mainMap){
    mainMap.setCenter({lat: 55.961642, lng: -4.820820});
}

window.addEventListener('load', initialize);