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
        
        // TimeLimit starts as Null
        marker.set("timeLimit", null);

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
    <p class="mb-0"><b>Lat:</b> <span class="lat">${latlng.lat()}</span></p>
    <p><b>Lng:</b> <span class="lng">${latlng.lng()}</span></p>
    <form class="d-flex flex-row" id="timeSelect">
        <select class="form-select form-select-sm" aria-label="Small select">
            <option selected value="n">No Time Limit</option>
            <option value="min">Minutes</option>
            <option value="h">Hours</option>
            <option value="d">Days</option>
        </select>
        <input class="form-control form-control-sm" type="number">
    </form>`

    //-- Actions
    const dropdownUnits = outermostCard.getElementsByTagName('select')[0];
    const numericInput = outermostCard.getElementsByTagName('input')[0];

    // Close btn 
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

    // Form Submit
    outermostCard.getElementsByTagName("form")[0].addEventListener("submit", function(event){
        // Prevent Refresh
        event.preventDefault();
        // Get Values
        let timeUnits = dropdownUnits.value;
        let timeValue = parseInt(numericInput.value);
        // Checks
        if (timeUnits == "n") {
            marker.set("timeLimit", null);
            alert("Input a value or remove time-constraint!");
            return; 
        }

        if (timeValue == 0) {
            numericInput.value = "";
            numericInput.style.display = "none";
            marker.set("timeLimit", null);
            return;
        }

        if (timeValue < 0) {
            alert("Don't use negative time values! Thats not cool!");
            return;
        }

        let minutesValue;
        
        switch(timeUnits) {
            case "min":
                minutesValue = timeValue;
                break;
            case "h":
                minutesValue = timeValue * 60;
                break;
            case "d":
                minutesValue = timeValue * 60 * 24;
                break;
        }
        marker.set("timeLimit", minutesValue);
    });

    // DropDown causes input to disappear
    dropdownUnits.addEventListener("change", function(){
        if (this.value == "n") {
            numericInput.value = "";
            numericInput.style.display = "none";
            marker.set("timeLimit", null);
        } else {
            numericInput.style.display = "block";
        }
    });

    marker.addListener("dragend", ()=>{
        let coords = marker.getPosition();
        outermostCard.getElementsByClassName("lat")[0].innerHTML = coords.lat();
        outermostCard.getElementsByClassName("lng")[0].innerHTML = coords.lng();
    })

    
    document.getElementById("points").appendChild(outermostCard);
}

window.initMap = initMap;
