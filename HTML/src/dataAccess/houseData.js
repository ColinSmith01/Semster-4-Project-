/*
  Functions used to work with Computer related data
*/

// Get a db connection by importing supabase.js which sets it up
import { Supabase } from './supabase.js';

// Function to get all events from supabase
//
async function getAllHouses() {

    // 1. define variable to store events
    let houses;

    // 1. execute query to get computers
    try {
      // 2. store result
      const result = await Supabase
        .from('house') // select data from the computers table
        .select('*') // all columns
        .order('postcode', { ascending: true }); // sort by name


      // 3. Read data from the result
      houses = await result.data;

      // Catch and log errors to server side console
    } catch (error) {
      console.log("Supabase Error - get all houses: ", error.message);
    } finally {
    }
    // 4. return all computers found
    return houses;
}

async function getHouseById(id) {

  // 1. define variable to store events
  let house;

  // 1. execute query to get computers
  try {
    // 2. store result
    const result = await Supabase
      .from('house') // select data from the computers table
      .select('*') // all columns
      .eq('id', id); // where id = id

    // 3. Read data from the result
    house = await result.data;

    // Catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all sensors: ", error.message);
  } finally {
  }

  // 4. return all computers found
  return house[0];
}

// Export functions for import elsewhere
export {
  getAllHouses,
  getHouseById
};