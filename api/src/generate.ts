// Script to generate random data for the last 24 hours
// Used for testing
import { exit } from "process";
import { DEVICE_COLLECTION_PREFIX } from "./api/constants";
import client from "./api/database";

/**
 * Generate a random series of
 * @param name The device to add data to 
 * @param from The unix time to start with
 * @param to The unix time to end with
 */
function genData(name: string, from: number, to: number, interval: number) {
    const collection = client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${name}`);
    collection.drop();
    const temp = [];
    
    // Generate random documents
    for (let i = 0; i < (to-from)/interval; i++) {
        const timestamp = (interval * i) + from;

        // Use random and sin to generate a random looking temperature curve
        temp.push({
            timestamp,
            temperature: {
                value: ((Math.random()+0.5 * Math.sin(i)) + 20).toFixed(2),
                units: "°C"
            }
        });
    }
    
    // Insert the documents, then exit this script
    collection.insertMany(temp)
    .then(() => {
        console.log("DONE");
        exit(0);
    });
}

const name = "Room-0.01"
const to = Date.now();
const from = Date.now() - (24*60*60*1000);
// Once per minute
const interval = 60*1000;

genData(name, from, to, interval);