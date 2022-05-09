// Script to generate random data for the last 24 hours
// Used for testing
import { exit } from "process";
import { DEVICE_COLLECTION_PREFIX } from "./api/constants";
import client from "./api/database";

const FROM_TIME = Date.now() - (24*60*60*1000);
const TO_TIME = Date.now();
const INTERVAL = 60*1000;

const args = process.argv.slice(2);

/**
 * Function to generate a sine wave with some random noise.
 * Used as part of the random data generation script.
 * f(x) = A sin(wt + p)
 * @param length The length of array to generate the sine wave over
 * @param amp Amplitude of the sine wave
 * @param freq Frequency of the sine wave
 * @param noise Factor to multiply random noise by
 * @returns The sine wave extended over an array of the given length
 */
function noisySineWave(length: number, amp=1, freq=1, noise=0.2) {
    const result = new Array<number>(length);

    for (let i = 0; i < result.length; i++) {
        result[i] = (amp * Math.sin(freq*(i/180)));
        result[i] = result[i] + (Math.random() * noise) - noise/2;
    }
    return result;
}

/**
 * Function to generate a square wave with the given parameters.
 * @param length The length of array to generate
 * @param period How many iterations before the square wave begins again
 * @param dutyCycle Value between 0 and 1, defines the duty cycle (power) of the square wave. A power of 1 is constantly on, and a power of 0 is constantly off.
 * @returns The generate square wave as an array of numbers
 */
function squareWave(length: number, period: number, dutyCycle=0.5) {
    const result = new Array<number>(length);

    for (let i = 0; i < result.length; i++) {
        if (i % period > period * dutyCycle) {
            result[i] = 1;
            continue;
        }
        result[i] = 0;
    }

    return result;
}


/**
 * Generate a random series of entries for the given room name
 * @param name The device to add data to 
 */
async function generateData(name: string) {
    const length = (TO_TIME-FROM_TIME)/INTERVAL;
    const temperature = noisySineWave(length, 5, 1, 1).map(v => Number((v + 20).toFixed(2)));
    const lightLevel = squareWave(length, length/10).map(v => (v*9000)+1000);
    const humidity = noisySineWave(length, 5, 5, 10).map(v => Number((v + 70).toFixed(0)));
    const CO2 = noisySineWave(length, 50, 20, 40).map(v => Number((v + 440).toFixed(0)));


    const collection = client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${name}`);
    await collection.drop();
    const temp = [];
    
    // Generate random documents
    for (let i = 0; i < length; i++) {
        const timestamp = (INTERVAL * i) + FROM_TIME;

        // Use random and sin to generate a random looking temperature curve
        temp.push({
            timestamp,
            temperature: {
                value: temperature[i],
                units: "°C"
            },
            "light level": {
                value: lightLevel[i],
                units: "lux"
            },
            humidity: {
                value: humidity[i],
                units: "%"
            },
            "CO2": {
                value: CO2[i],
                units: "ppm"
            }
        });
    }
    
    // Insert the documents, then exit this script
    await collection.createIndex({timestamp: 1}, {name: "timestamp"});
    await collection.insertMany(temp);
}

async function main(args: string[]) {
    const names = args;

    // Generate data for each name provided as an argument
    for (const name of names) {
        await generateData(name); 
        console.log(`Data created for '${name}'`);
    }
}

main(args)
    .then(() => {
        console.log("Done");
        exit(0);
    })
    .catch(() => {
        console.log("Failed");
        exit(1)
    });
