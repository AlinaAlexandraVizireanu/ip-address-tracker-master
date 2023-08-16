const form = document.querySelector("form");
const textInput = document.querySelector("#text");
const ipInfo = document.querySelector("#ip-info");
const locationInfo = document.querySelector("#location-info");
const timezoneInfo = document.querySelector("#timezone-info");
const ispInfo = document.querySelector("#isp-info");

const map = L.map("map").setView([0, 0], 13);
const locationIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [12, 56],
  popupAnchor: [12, -55],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/// -------Fetching on first load---------
axios
  .get("http://ip-api.com/json/")
  .then((response) => {
    return Promise.resolve(response.data.query);
  })
  .then((response) => {
    return axios.get(`http://ip-api.com/json/${response}`);
  })
  .then((response) => {
    let ip = response.data.query;
    let location = `${response.data.city}, ${response.data.country} ${response.data.zip}`;
    let timezone = `UTC ${response.data.timezone}`;
    let isp = response.data.isp;
    let lat = response.data.lat;
    let lng = response.data.lon;

    ipInfo.innerText = ip;
    locationInfo.innerText = location;
    timezoneInfo.innerText = timezone;
    ispInfo.innerText = isp;

    marker = L.marker([lat, lng], { icon: locationIcon })
      .addTo(map)
      .bindPopup("Current location of your IP Address")
      .openPopup();

    map.setView([lat, lng], 13);
  })
  .catch((err) => {
    alert("Something went wrong");
  });
/// -------Fetching on first load---------

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (textInput.value === "") {
    alert("Please introduce an IP address or a domain");
  } else {
    // Regular expression that matches an IPv4 address
    let regexp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;

    axios
      .get(
        `http://ip-api.com/json/${
          regexp.test(textInput.value) ? textInput.value : textInput.value
        }`
      )
      .then((response) => {
        let ip = response.data.query;
        let location = `${response.data.city}, ${response.data.country} ${response.data.zip}`;
        let timezone = `UTC ${response.data.timezone}`;
        let isp = response.data.isp;
        let lat = response.data.lat;
        let lng = response.data.lon;

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
        ipInfo.innerText = "";
        locationInfo.innerText = "";
        timezoneInfo.innerText = "";
        ispInfo.innerText = "";
      });
  }
});
