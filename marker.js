

function createNodeCard(marker, startingPoint) {

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
      </form>
    `;

    //-- Actions
    const dropdownUnits = outermostCard.getElementsByTagName('select')[0];
    const numericInput = outermostCard.getElementsByTagName('input')[0];

    // Close btn 
    outermostCard.getElementsByClassName('btn-close')[0].addEventListener("click",()=>{
        nodes = nodes.filter((e) => {
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

    // Drag events
    marker.addListener("dragend", ()=>{
        let coords = marker.getPosition();
        outermostCard.getElementsByClassName("lat")[0].innerHTML = coords.lat();
        outermostCard.getElementsByClassName("lng")[0].innerHTML = coords.lng();
    })

    // Starting Node
    marker.set("setStartingNode", function() {
        let alerts = outermostCard.getElementsByClassName("alert");
        if (alerts && alerts.length != 0) return;
        removeStartingTagFromAllNodes()
        let newElement = document.createElement("div");
        newElement.classList.add("alert", "alert-success");
        newElement.innerText = "Starting Node!";
        outermostCard.insertBefore(newElement, outermostCard.firstChild);
        marker.set("startingNode", true);
    });

    marker.set("setNotStartingNode", function() {
        let alerts = outermostCard.getElementsByClassName("alert");
        if (alerts.length == 0) return;
        alerts[0].remove?.();
        marker.set("startingNode", false);
    });

    
    if(startingPoint) marker.setStartingNode();

    marker.addListener("dblclick", ()=>{
        marker.setStartingNode();
    })
    
    document.getElementById("points").appendChild(outermostCard);
}