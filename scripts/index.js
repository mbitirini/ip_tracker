  // Initialize LeafletJS map
  const mymap = L.map("mapid", { zoomControl: false,}).setView([0, 0], 1);
  
  // TileLayer for the map
  // (Used to load and display tile layers on the map)
  const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{minZoom: 2, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}).addTo(mymap);

  // Initialize marker
  // (L.Marker is used to display clickable/draggable icons on the map)
  const marker = L.marker([50.5, 30.5]).addTo(mymap);
  
  // Get elements from the dom
  const form = document.querySelector(".form");
  const resultContainer = document.querySelector(".result");
  
  // IP Geolocation API by IPify
  const api_url = "https://geo.ipify.org/api/v1?";
  const api_key = "apiKey=at_e4NRJD9bNL92iD61yJJnJGSm2g2D8";
  
  // Set initial value to the user IP
  initialIp();
  loading();
  
  // Listen for a submit event
  form.addEventListener("submit", getLocation);
  
  async function getLocation(e) {
    // Stop default POST action from the form
    e.preventDefault();
    // Get the value from the search input
    const inputValue = document.getElementById("input-search").value;
    // Loading animation
    loading();
  
    // Using fetch to get data from IP Geolocation API
    const search = await fetch(api_url + api_key + "&domain=" + inputValue)
      .then((res) => {
        // checking if IP is valid
        if (res.status != 200) {
          document.querySelector(".result").innerHTML = `
          <div class="error-message">
            <p>Invalid ip please, try again.</p>
          </div>`;
        } 
        else {
          return res.json();
        }
      })
      .then((data) => {
        setLocation(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  // Loading gif 
  function loading() {
    document.querySelector(".result").innerHTML = `
    <div class="load">
      <img src="images/loading.gif"/>
    </div>`;
  }
  
  // Set initial value to the user IP
  async function initialIp() {
    await fetch(api_url + api_key + "&domain")
      .then((res) => res.json())
      .then((data) => {
        setLocation(data);
      });
  }
  
  // Set location
  function setLocation(results) {
    const { ip, location, isp } = results;
    let output = "";
    output += `
             <div class="separator">
               <span>IP address</span>
               <h2>${ip}</h2>
             </div>
             <div class="separator">
              <span>Location</span>
              <h2>${location.country}, ${location.region}, ${location.city}</h2>
             </div>
             <div class="separator">
               <span>Timezone</span>
               <h2>UTC ${location.timezone}</h2>
             </div>
             <div class="separator">
               <span>ISP</span>
               <h2>${isp}</h2>
             </div>`;
    resultContainer.innerHTML = output;
    // Set location
    mymap.flyTo([location.lat, location.lng], 15, { duration: 4 });
    // Update marker
    marker.setLatLng([location.lat, location.lng]).bindPopup(location.city);
  }
  