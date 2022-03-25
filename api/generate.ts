// Script to generate random data for testing
import { exit } from "process";
import { DEVICE_COLLECTION_PREFIX } from "./src/api/constants";
import client from "./src/api/database";

/**
 * Generate a random series of
 * @param name The device to add data to 
 * @param from The unix time to start with
 * @param to The unix time to end with
 */
function genData(name: string, from: number, to: number, interval: number) {
    const temp = [];
    // Generate random documents
    for (let i = from; i < to; i = i + interval) {
        temp.push({
            timestamp: i,
            temperature: Math.floor(Math.random() * (25 - 18) ) + 18
        });
    }
    client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${name}`).insertMany(temp)
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