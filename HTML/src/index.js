// Import dependencies
import * as sensorData from "./dataAccess/sensorData.js";
import * as houseData from "./dataAccess/houseData.js";
import * as adminData from "./dataAccess/adminData.js";

/*
  Functions used to update the index page view
*/

// Display event objects in a table element
//
function displaySensorList(sensors) {
  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="eventRows"> element.

  // page element where rows will be inserted
  const sensorRows = document.getElementById("sensorRows");


  const tableRows = sensors.map((sensor) => {
    // Return a table row for each events
    // each row added to the tableRows array
  const levelStyle = getAlertStyle(sensor.sensor_status);

    return `<tr class="${levelStyle.alert}">
      <td>${sensor.id}</td>
      <td>${sensor.sensor_num}</td>
      <td data-toggle="tooltip" title="room_id=${sensor.room_id}">${sensor.rooms.room_info}</td>
      <td>${sensor.sensor_status}</td>
      <td>${sensor.description}</td>
      <td>${new Date(sensor.timestamp).toLocaleString()}</td>
      <td>
        <button data-sensor_id="${sensor.id}" 
        class="btn btn-sm btn-outline-light btn-delete-sensor">
        <span class="bi bi-trash" data-toggle="tooltip" 
          title="Delete Sensor">
        </span></button>
      </td>
    </tr>`;
  }); // end events.map

  // Add rows to the table body
  sensorRows.innerHTML = tableRows.join('');

    // Add Event listeners
  //
  // 1. Find button all elements with matching class name
  const deleteButtons = document.getElementsByClassName('btn-delete-sensor');

    // 2. Assign a 'click' event listener to each button
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteSensor);
  }

} // End function

// 1. Parse JSON
// 2. Create computer links
// 3. Display in web page
//
function displayHouses(houses) {

  // Use the Array map method to iterate through the array of computers (in json format)
  const houseLinks = houses.map((house) => {

    // return a link button for each computer, setting attribute data-computer_id for the id
    // Also edit and delete buttons
    return `<div class="btn-group">
      <button data-house_id="${house.id}" class="list-group-item list-group-item-action house-button">${house.postcode}
      <button data-house_id="${house.id}" 
          class="btn btn-sm btn-outline-primary btn-update-house" 
          data-bs-toggle="modal" data-bs-target="#HouseFormDialog" >
          <span class="bi bi-pencil-square blue-color"
          data-toggle="tooltip" title="Edit House">
          </span>
      </button>
      <button data-house_id="${house.id}" 
          class="btn btn-sm btn-outline-danger btn-delete-house">
          <span class="bi bi-trash" data-toggle="tooltip" 
          title="Delete House">
          </span>
      </button>
    </div>`;

  }); // end computers.map

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

  // Set the innerHTML of the eventRows root element = rows
  // join('') converts the rows array to a string, replacing the ',' delimiter with '' (blank)
  document.getElementById('houseList').innerHTML = houseLinks.join("");

  // Add Event listeners to handle clicks
  // When clicked, the computer links will filter events - displaying  events for that computer
  //
  // 1. Find button all elements with matching the class name used to identify computer buttons
  const houseButtons = document.getElementsByClassName('house-button');
  const deleteButtons = document.getElementsByClassName('btn-delete-house');
  const updateButtons = document.getElementsByClassName('btn-update-house');

  // 2. Assign a 'click' event listener to each button
  // When clicked the filterComputer() function will be called.
  for (let i = 0; i < houseButtons.length; i++) {
    houseButtons[i].addEventListener('click', filterHouses);
  };

  // Set up delete buutons
  // setup edit buttons
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteHouse);
    updateButtons[i].addEventListener('click', prepareUpdate);
  }
} // end function


// Show events for the selected computer
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

//
// Setup computer form with defaults
//
function houseFormSetup(sensor, formTitle = 'Add a new House') {
  // reset the form and change the title
  document.getElementById('houseForm').reset();
  document.getElementById('houseFormTitle').innerText = formTitle;

  // form reset doesn't work for hidden inputs!!
  // do this to rreset previous id if set
  document.getElementById("id").value = 0;
} // end function

// Fill the form when an edit button is clicked
async function prepareUpdate() {

  // Get the computer using the computer_id value of the clicked butoon
  const house = await houseData.getHouseById(this.dataset.house_id);

  // If found - fill the form
  if (house) {
    //Set form input values
    houseFormSetup(0, `Update House ID: ${house.id}`);
    houseForm.id.value = house.id;
    houseForm.postcode.value = house.postcode;
  }

} // End function

// Get values from computer form
// return as an object
function getHouseFormData() {
  // use form and input NAMES to access values
  // Note: These should be validated!!
  return {
    id: Number(houseForm.id.value),
    postcode: houseForm.postcode.value
  };

} // End function

//
// Called when computer form is submitted
//
async function addOrUpdateHouse() {
  const house = getHouseFormData();
  let result;

  // New computer will have id set to 0
  if (house.id === 0) {
    // add new
    result = await adminData.addHouse(house);
  } else {
    // update existing
    result = await adminData.updateHouse(house);
  }
  return result;
} // End function


// Delete event by id using an HTTP DELETE request
async function deleteHouse() {
  // Confirm delete
  if (confirm(`Are you sure you want to delete house id = ${this.dataset.house_id} ?`)) {
    // call the delete function (from adminData.js)
    // passing the data-computer_id value of the clicked button
    const result = await adminData.deleteHouse(this.dataset.house_id);
  }
} // End function

// Delete event by id
async function deleteSensor() {
  // Confirm delete
  if (confirm(`Are you sure you want to delete sensor id = ${this.dataset.sensor_id} ?`)) {
    // call the delete function (from adminData.js)
    // passing the data-computer_id value of the clicked button
    const result = await adminData.deleteSensorById(this.dataset.sensor_id);
  } 
} // End Function

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

// Get JSON array of events
// Then pass that data for display
//
async function loadAndDisplayData() {
  
  // Load all computers and display
  const houses = await houseData.getAllHouses();
  console.log("houses:", houses);
  displayHouses(houses);
  
  // load all events and display
  const sensors = await sensorData.getAllSensors();
  console.log("sensors:", sensors);
  displaySensorList(sensors);
}

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

export { loadAndDisplayData, filterSearch, toggleSortTime };

// Add event listener to the Add event Button
document.getElementById('AddHouseButton').addEventListener('click', houseFormSetup);

// Add event listner to form submit/ save button
// Second param is an inline function - used as the event object is required
document.getElementById('formSubmit').addEventListener('click',addOrUpdateHouse);

document.getElementById('btnSearch').addEventListener('click', filterSearch);

document.getElementById('timeSort').addEventListener('click', toggleSortTime)


// Initial data load
loadAndDisplayData();

// Subscribe to changes (e.g. new events)
// This will refresh display when new events are added
const sensorsSub = sensorData.Supabase
  .from('*')
  .on('*', loadAndDisplayData)
  .subscribe();