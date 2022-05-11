import { MongoClient } from 'mongodb';
import { MONGODB_URI } from './constants';
import devicesFile from "./data/devices.json"
import { Device } from './types';

// Connect to database
const client = new MongoClient(MONGODB_URI);
client.connect().then(() => {
    console.log("Database connected...");
})
    .catch((reason) => {
        console.error(reason);
    });

// Import devices into the database
async function importDevices() {
    const offset = devicesFile.offset;
    const devices = devicesFile.devices;

    // Apply offset and add any attributes we need here
    devices.forEach((device: Device) => {
        device.position.x -= offset.x;
        device.position.y -= offset.y;
        device.position.z -= offset.z;
    });

    // Drop all existing devices
    // Wrap this in try catch as it will fail if the collection does not exist
    try { await client.db().collection("devices").drop(); }
    catch (e) { }
    // Insert new ones
    return await client.db().collection("devices").insertMany(devices);
}

// Call function and log whether it is successful
importDevices()
    .then(() => {
        console.log("Devices import successful");
    })
    .catch((err) => {
        console.log(`Device import failed with '${err}'`);
    })

export = client;
