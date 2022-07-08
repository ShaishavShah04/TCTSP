// Global Varibles
var nodes = [];
const labelRetriever = new LabelRetriever();
var distanceMatrix; 
var memoizationHashMap = new Map();
var finalRoute = []

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

window.initMap = initMap;


function removeStartingTagFromAllNodes() {
    nodes.forEach((m) => m.setNotStartingNode());
}

function solve(response, status) {
    if (status == 'OK') {

        distanceMatrix = response;

        let indexOfStartingNode = nodes.findIndex((n) => n.startingNode);
        let setOfRemainingNodes = new Set(nodes.keys());
        setOfRemainingNodes.delete(indexOfStartingNode);

        let result = solveRecursiveHelper(indexOfStartingNode, setOfRemainingNodes);

        console.log(memoizationHashMap);

        traceRoute(indexOfStartingNode, setOfRemainingNodes);

        console.log(finalRoute);
    }
}

function solveRecursiveHelper(startingNodeIndex, remainingNodes) {
    
    // Logging
    console.log("Solving for:", startingNodeIndex, remainingNodes);

    // If we somehow end up calling this function with zero remaining nodes
    if (!remainingNodes.size) {
        console.log("Called with 0 nodes!")
        return 0;
    }

    // If we are only having 2 node, don't do any calculations of minimum.
    if (remainingNodes.size == 1) {
        let d = distanceMatrix.rows[startingNodeIndex].elements[remainingNodes.values().next().value].duration.value;
        console.log("Distance determined to be ", d);
        return d;
    }

    let min = Number.MAX_SAFE_INTEGER;
    let nextNode;

    remainingNodes.forEach((value)=>{
        let distanceFromStartingNode = distanceMatrix.rows[startingNodeIndex].elements[value].duration.value;
        let remainingNodesForRecursion = new Set([...remainingNodes]);
        remainingNodesForRecursion.delete(value);
        let distanceComputedRecursively = solveRecursiveHelper(value, remainingNodesForRecursion);
        
        let totalDistance = distanceComputedRecursively + distanceFromStartingNode;

        if (totalDistance < min) {
            min = totalDistance;
            nextNode = value;
        }
    });

    memoizationHashMap.set({
        from: startingNodeIndex,
        to: remainingNodes
    }, nextNode);

    return min;
}

// This function will append the correct remaing node to the order
function traceRoute(startingNode, remainingNodes) {

    if (remainingNodes.size == 1) {
        finalRoute.push(remainingNodes.values().next().value);
        return;
    }

    let mapKey = {
        from: startingNode,
        to: remainingNodes
    };

    console.log(mapKey);

    let nextNodeToVisit = memoizationHashMap.forEach((v, k)=>{
        console.log(k == mapKey, k.to == mapKey.to, k.from == mapKey.from);
    });

    console.log(startingNode, nextNodeToVisit);

    finalRoute.push(nextNodeToVisit);
    remainingNodes.delete(nextNodeToVisit);
    // traceRoute(nextNodeToVisit, remainingNodes);
}

function getDistanceMatrix() {
    let latLngOfNodes = nodes.map(n => n.getPosition());
    let service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: latLngOfNodes,
        destinations: latLngOfNodes,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(),
            trafficModel: 'optimistic'
        }
    }, solve);
}
