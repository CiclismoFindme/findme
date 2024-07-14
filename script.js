let map;
let marker;
let geocoder;
let responseDiv;
let response;
let warningCircle;
let dangerCircle;

function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 15
        });
        marker = new google.maps.Marker({
            position: { lat: position.coords.latitude, lng: position.coords.longitude },
            map: map
        });

        geocoder = new google.maps.Geocoder();

        const inputText = document.getElementById("search-input");

        const clearButton = document.createElement("input");
        clearButton.type = "button";
        clearButton.value = "Clear";
        clearButton.classList.add("button", "button-secondary");

        response = document.createElement("pre");
        response.id = "response";
        response.innerText = "";
        responseDiv = document.createElement("div");
        responseDiv.id = "response-container";
        responseDiv.appendChild(response);

        const instructionsElement = document.createElement("p");
        instructionsElement.id = "instructions";
        instructionsElement.innerHTML =
            "<strong>Instrucciones</strong>: Ingrese una dirección en el cuadro de texto para buscar o haga clic en el mapa.";

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);

        map.addListener("click", (e) => {
            geocode({ location: e.latLng });
        });

        inputText.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                geocode({ address: inputText.value });
            }
        });

        clearButton.addEventListener("click", () => {
            marker.setMap(null);
            response.innerText = "";
        });
    });
}

function geocode(request) {
    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;

            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            response.innerText = JSON.stringify(result, null, 2);
            return results;
        })
        .catch((e) => {
            console.error("Geocode was not successful for the following reason: " + e);
        });
}

function toggleMap() {
    const mapDiv = document.getElementById('map');
    if (mapDiv.style.display === "none") {
        mapDiv.style.display = "block";
    } else {
        mapDiv.style.display = "none";
    }
}

function showWarning() {
    if (warningCircle) {
        warningCircle.setMap(null);
    }
    warningCircle = new google.maps.Circle({
        strokeColor: "#FFEB3B",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FFEB3B",
        fillOpacity: 0.35,
        map,
        center: marker.getPosition(),
        radius: 100
    });
    showAlert("alert-box");
}

function showDanger() {
    if (dangerCircle) {
        dangerCircle.setMap(null);
    }
    dangerCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: marker.getPosition(),
        radius: 100
    });
    showAlert("danger-box");
}

function showAlert(boxId) {
    const alertBox = document.getElementById(boxId);
    alertBox.style.display = "block";
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 15000); // 15 segundos
}
