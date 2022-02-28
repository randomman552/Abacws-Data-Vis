import { MongoClient } from 'mongodb';
import { MONGODB_URI } from './constants';

// Connect to database
const client = new MongoClient(MONGODB_URI);
client.connect().then(() => { 
    console.log("Database connected...");
})
.catch((reason) => { 
    console.error(reason);
});

export = client;
