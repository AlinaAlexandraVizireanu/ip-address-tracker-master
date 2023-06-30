const form = document.querySelector("form");
const textInput = document.querySelector("#text");
const ipInfo = document.querySelector("#ip-info");
const locationInfo = document.querySelector("#location-info");
const timezoneInfo = document.querySelector("#timezone-info");
const ispInfo = document.querySelector("#isp-info");

// ----------Configuration of the map----------

var map = L.map("map").setView([51.505, -0.09], 13);

var locationIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconAnchor: [22, 94],
  popupAnchor: [1, -90],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([51.505, -0.09], { icon: locationIcon })
  .addTo(map)
  .bindPopup("A pretty CSS popup.<br> Easily customizable.")
  .openPopup();

// ----------Configuration of the map----------

form.addEventListener("submit", function (e) {
    e.preventDefault();
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
  
        L.marker([lat, lng], { icon: locationIcon })
          .addTo(map)
          // .bindPopup("A pretty CSS popup.<br> Easily customizable.")
          // .openPopup();
      })
      .catch((err) => {
        console.log("Something went wrong!");
        console.log(err);
      });
  });


