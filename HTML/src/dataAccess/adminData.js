/*
  Admin db access
*/

// Get a db connection by importing supabase.js which sets it up
import { Supabase } from './supabase.js';

// Insert a new computer
async function addHouse(house) {
    console.log('insert house id: ', house.id);
    const result = await Supabase
    .from('house')
    .insert([
        { postcode: house.postcode
        },
    ]);

    // return the result data
    return result.data;
} // end function

// update an existing computer
async function updateHouse(house) {
    console.log('to update: ', house.id);
    const result= await Supabase
    .from('house')
    .update([
        { postcode: house.postcode
        },
    ])
    // update where id matches comp.id
    .eq('id', house.id);

    // return the result data
    return result.data;
}

// delete a computer
async function deleteHouse(id) {

    // before deleting computer, delete its events
    const del_Sensors = deleteHouseSensors(id);
    
    const result= await Supabase
    .from('house')
    .delete()
    .eq('id', id);

    // return the result data
    return result.data;
}

// delete a computers events
async function deleteHouseSensors(house_id) {
    
    const result= await Supabase
    .from('sensors')
    .delete()
    .eq('house_id', house_id);

    // return the result data
    return result.data;
}

// delete an event
async function deleteSensorById(id) {
    
    const result= await Supabase
    .from('sensors')
    .delete()
    .eq('id', id);

    // return the result data
    return result.data;
}

// Export functions for import elsewhere
export {
    addHouse,
    updateHouse,
    deleteHouse,
    deleteSensorById,
    deleteHouseSensors
  };