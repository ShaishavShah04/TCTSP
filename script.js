// Global Varibles
const nodes = [];
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

        // Create card
        createNodeCard(marker);
    
        nodes.push(marker);
    });


}

function createNodeCard(marker) {
    let latlng = marker.getPosition();
    const outermostCard = document.createElement("div");
    outermostCard.classList.add("pointCard");
    outermostCard.innerHTML = 
    `<div class="d-flex flex-row justify-content-between">
      <h5>Point ${marker.getLabel()}</h5>
      <button id="removePointBtn" type="button" class="btn-close" aria-label="Close"></button>
    </div>
    <p class="mb-0"><b>Lat:</b> ${latlng.lat()}</p>
    <p><b>Lng:</b> ${latlng.lng()}</p>
    <form class="d-flex flex-row" id="timeSelect">
      <input class="form-control form-control-sm" type="text">
      <select class="form-select form-select-sm" aria-label="Small select">
        <option selected="" value="none">No Time Limit<option>
        <option value="m">Minutes</option>
        <option value="h">Hours</option>
        <option value="d">Days</option>
      </select>
    </form>`

    // Actions
    outermostCard.getElementsByClassName('btn-close')[0].addEventListener("click",()=>{
        nodes.filter((e) => {
            if (e == marker) {
                marker.setMap(null);
                return false;
            } else {
                return true;
            }
        });
        document.getElementById("points").removeChild(outermostCard);
    }); 

    // let title = document.createElement("h5");
    // title.innerText = "Point " + marker.getLabel();
    // let btn = document.createElement("button");
    // btn.classList.add('btn-close')
    // btn.type="button";
    // btn.addEventListener("click",()=>{
    //     nodes.filter((e) => {
    //         if (e == marker) {
    //             marker.setMap(null);
    //             return false;
    //         } else {
    //             return true;
    //         }
    //     })
    //     document.getElementById("points").removeChild(outermostCard);
    // }); 
    // let div = document.createElement("div");
    // div.classList.add("d-flex","flex-row","justify-content-between");
    // div.appendChild(title);
    // div.appendChild(btn);
    // outermostCard.appendChild(div);
    // let p = document.createElement("p");
    // p.classList.add("mb-0");
    // let latlng = marker.getPosition();
    // p.innerHTML = `<b>Lat: </b> ${latlng.lat()}`;
    // outermostCard.appendChild(p);
    // p = document.createElement("p");
    // p.innerHTML = `<b>Lng: </b> ${latlng.lng()}`;
    // outermostCard.appendChild(p);
    document.getElementById("points").appendChild(outermostCard);
}

window.initMap = initMap;
