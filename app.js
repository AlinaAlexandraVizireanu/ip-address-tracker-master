const form = document.querySelector("form");
const textInput = document.querySelector("#text");
const ipInfo = document.querySelector("#ip-info");
const locationInfo = document.querySelector("#location-info");
const timezoneInfo = document.querySelector("#timezone-info");
const ispInfo = document.querySelector("#isp-info");
let marker = null;

// ----------Configuration of the map----------

var map = L.map("map").setView([51.505, -0.09], 13);

var locationIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [12, 56],
  popupAnchor: [12, -55],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

marker = L.marker([51.505, -0.09], { icon: locationIcon })
  .addTo(map)
  .bindPopup("Default location")
  .openPopup();

// ----------Configuration of the map----------

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (textInput.value === "") {
    alert("Please introduce an IP address or a domain");
  } else {
    let regexp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;

    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_mExeSqk8jHaRZjAEgponMhR3QlYDH&${
          regexp.test(textInput.value)
            ? "ipAddress=" + textInput.value
            : "domain=" + textInput.value
        }`
      )
      .then((response) => {
        let ip = response.data.ip;
        let location = `${response.data.location.city}, ${response.data.location.country} ${response.data.location.postalCode}`;
        let timezone = `UTC${response.data.location.timezone}`;
        let isp = response.data.isp;
        let lat = response.data.location.lat;
        let lng = response.data.location.lng;

        ipInfo.innerText = ip;
        locationInfo.innerText = location;
        timezoneInfo.innerText = timezone;
        ispInfo.innerText = isp;

        if (marker) {
          map.removeLayer(marker);
        }

        marker = L.marker([lat, lng], { icon: locationIcon })
          .addTo(map)
          .bindPopup("Location of the requested IP Address or domain")
          .openPopup();

        map.setView([lat, lng], 13);
      })
      .catch((err) => {
        alert("Please introduce a valid IP address or domain");
      });
  }
});