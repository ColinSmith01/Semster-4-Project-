// Import dependencies
import * as sensorData from "./dataAccess/sensorData.js";
import * as houseData from "./dataAccess/houseData.js";

/*
  Functions used to update the index page view
*/



// Display house objects in a table element
//
function displaySensorList(sensors) {

  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="eventRows"> element.

  // page element where rows will be inserted
  const eventRows = document.getElementById("sensorRows");

  const tableRows = sensors.map((sensor) => {
    // Get the styling object for this level - for use below
    // Note: the following is a template string, enclosed by `backticks` and not 'single quptes'
    // This allows ${JavaScript} to be added directl to the string if enclosed by ${ }
    // See https://wesbos.com/template-strings-html for more.

    const levelStyle = getAlertStyle(sensor.sensor_status);

    return `<tr class="${levelStyle.alert}">
          <td>${sensor.id}</td>
          <td>${sensor.sensor_num}</td>
          <td data-toggle="tooltip" title="room_id=${sensor.room_id}">${sensor.rooms.room_info}</td>
          <td>${sensor.sensor_status}</td>
          <td>${sensor.description}</td>
          <td>${new Date(sensor.timestamp).toLocaleString()}</td>
      </tr>`;
  });

  // Add rows to the table body
  eventRows.innerHTML = tableRows.join("");
}

// 1. Parse JSON
// 2. Create computer links
// 3. Display in web page
//
function displayHouses(houses) {

  // Use the Array map method to iterate through the array of categories (in json format)
  const houseLinks = houses.map((house) => {

    // return a link button for each computer, setting attribute data-computer_id for the id
    // the data attribute is used instead of id as an id value can only be used once in the document
    // note the computer-link css class - used to identify the buttons (used later)
    return `<button data-house_id="${house.id}" class="list-group-item list-group-item-action house-button">
              ${house.postcode}
            </button>`;

  });
  

  // Add a link for 'all computers' to start of the list
  // first check compLinks is an array
  if (Array.isArray(houseLinks)) {
    // Then use unshift to move all elements up one and insert a new element at the start
    // This button has computer_id=0
    houseLinks.unshift(`<button data-house_id="0" 
                        class="list-group-item list-group-item-action house-button">
                        All Houses
                      </button>`);
  }

  // Set the innerHTML of the productRows root element = rows
  // join('') converts the rows array to a string, replacing the ',' delimiter with '' (blank)
  document.getElementById('houseList').innerHTML = houseLinks.join("");

  // Add Event listeners to handle clicks
  // When clicked, the computer links will filter events - displaying  events for that computer
  //
  // 1. Find button all elements with matching the class name used to identify computer buttons
  const houseButtons = document.getElementsByClassName('house-button');

  // 2. Assign a 'click' event listener to each button
  // When clicked the filterComputer() function will be called.
  for (let i = 0; i < houseButtons.length; i++) {
    houseButtons[i].addEventListener('click', filterHouses);
  }
}

// Show events for selected computer
//
async function filterHouses() {

  // Get id of cat link (from the data attribute)
  // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
  const houseId = Number(this.dataset.house_id);

  // validation - if 0 or NaN reload everything
  if (isNaN(houseId) || houseId == 0) {
    loadAndDisplayData();
  
  // Otherwise get events for this computer
  } else {

    // Get events
    const sensors = await sensorData.getSensorByHouseId(houseId);

    // If events returned then display them
    if (Array.isArray(sensors)) {
      displaySensorList(sensors);
    }
  }
}


// Function to show events based on search box text
//
async function filterSearch() {

  // read the value of the search input field
  const search = document.getElementById('inputSearch').value;
  
    // Get events by calling eventData.Search
    const sensors = await sensorData.searchFilter(search);

    // If events returned then display them
    if (Array.isArray(sensors)) {
      displaySensorList(sensors);
    }

}

async function toggleSortTime() {

  // read current sort order from session storage if true
  let sTime = JSON.parse(sessionStorage.getItem('sortTime')) === true;

  // set session storage value to opposite (not sUser or !sUser)
  sessionStorage.setItem('sortTime', !sTime);

  // load events - passs filter options as parameters
  const sensors = await sensorData.getAllSensors('timestamp', !sTime);
  console.log("sensors:", sensors);
  displaySensorList(sensors);

}

function getAlertStyle(sensor_status) {
  const On = {
    alert: 'alert alert-success'
  };

  const Off = {
    alert: 'alert alert-danger'
  };

  const _default = {
    alert: 'alert alert-light'
  };


  // return style object based on level value
  switch (sensor_status) {
    case 'On':
      return On;
    case 'Off':
      return Off;

    // Everything else
    default:
      return _default;
  }
}


// Get JSON array of events
// Then pass that data for display
//
async function loadAndDisplayData() {
  // load all events and display
  // use the event repository to get the data

  const houses = await houseData.getAllHouses();
  console.log('houses:', houses);
  displayHouses(houses);


  const sensors = await sensorData.getAllSensors();
  console.log('sensors:', sensors);
  displaySensorList(sensors);


}


  export { loadAndDisplayData, filterSearch, toggleSortTime };

  // Add house listners to page elements
  // document.getElementById('inputSearch').addEventListener('keypress', filterSearch);
  document.getElementById('btnSearch').addEventListener('click', filterSearch);

  document.getElementById('timeSort').addEventListener('click', toggleSortTime)




// Get and display data when the page loads
loadAndDisplayData();

const sensorsSub = sensorData.Supabase
  .from('*')
  .on('*', loadAndDisplayData)
  .subscribe();