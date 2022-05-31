/*
  Functions used to work with Event related data
*/


// Get a db connection
import { Supabase } from './supabase.js';

//
// Get all events as a list (array) of Event Objects
// Also replace the Computer id with name in each event
//
async function getAllSensors(orderCol= 'timestamp', asc = false) {

    // define variable to store events
    let sensors;

    // execute request
    // Note await in try/catch block
    try {
      // Supabase API query equivelent to:
      // select *, computers.name from events, computers order by timestamp desc;
      const result = await Supabase
        .from('sensors')
        .select('*, rooms(room_info)')
        .order(orderCol , { ascending: asc });

      // rresult.data contains the events
      sensors = await result.data;
      // Debug
      //console.log('events: ', result.data);

      // Catch and log errors to server side console
    } catch (error) {
      console.log("Supabase Error - get all sensors: ", error.message);
    } finally {
    }
    // return all products found
    return sensors;
}

// Get events for a computer, by its id
//
async function getSensorByHouseId(id) {

  // to do: validate id

  // define variable to store events
  let sensors;

  // execute db query
  try {
    // Execute the query
    const result = await Supabase
      .from('sensors') // select from events
      .select('*, rooms(room_info)') // * from events and name from computers
      .eq('house_id', id) // where computer_id == id
      .order('timestamp', { ascending: false}); // order by timestamp

    // first element of the recordset contains products
    sensors = await result.data;
    //console.log('events: ', result.data);

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all sensors: ", error.message);
  } finally {
  }
  // return all products found
  return sensors;
}

async function getSensorById(id) {

  // to do: validate id

  // define variable to store events
  let sensor;

  // execute request
  // Note await in try/catch block
  try {
    // Execute the query
    const result = await Supabase
      .from('sensors')
      .select('*, rooms(room_info)')
      .eq('id', id)
      .order('timestamp', { ascending: false });

    // first element of the recordset contains products
    sensor = await result.data;
    //console.log('events: ', result.data);

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all sensor: ", error.message);
  } finally {
  }
  // return all products found
  return sensor;
}

async function searchFilter(search) {
  // define variable to store events
  let sensors;

  // execute request
  try {
    // Execute the query
    const result = await Supabase
    .from('sensors') // from events
    .select('*, rooms(room_info)') // select all and computers.name
    .textSearch('sensor_num', `'${search}'`);// filter result where description contains the search term  

    // get data from result
    sensors = await result.data;
    //console.log('events: ', result.data);

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all sensors: ", error.message);
  } finally {
  }
  // return all events found
  return sensors;
}




// Export
export {
  Supabase,
  getAllSensors,
  getSensorByHouseId,
  getSensorById,
  searchFilter
};
