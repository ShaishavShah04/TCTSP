// Global Varibles
var nodes = [];
const labelRetriever = new LabelRetriever();

// Initialize and add the map
function initMap() {

    // Create map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: { lat: 49.030473639870515, lng: -101.66571086382145 },
        gestureHandling: "greedy",
        restriction: {
            latLngBounds: {
                north: 83.863703,
                south: 6.995495,
                east: -52.61929,
                west: 172.45,
            },
            strictBounds: true,
        },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
  });

    // Adding Marker on Click
    map.addListener("click", (e) => {

        // Get new label
        let label = labelRetriever.getNewLabel();

        // Create marker
        const marker = new google.maps.Marker({
            position: e.latLng,
            map,
            draggable: true,
            label,
        });
        
        // TimeLimit starts as Null
        marker.set("timeLimit", null);
        marker.set("startingNode", false);

        // Create card
        createNodeCard(marker, !nodes.length);
    
        nodes.push(marker);
    });

}

function removeStartingTagFromAllNodes() {
    nodes.forEach((m) => m.setNotStartingNode());
}

window.initMap = initMap;
