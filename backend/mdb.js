// connecting to MongoDB Database


const { MongoClient } = require("mongodb"); // importing mongodb client
const uri = require("./uri.js");



const client = new MongoClient(uri);
const dbname = "Bits-Of-Good"

// connection method
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database`);
    } catch (err) {
        console.error(`Error: ${err}`);
    }
};



const main = async () => {
    try {
        await connectToDatabase();
    } catch (err) {
        console.error(`Error: ${err}`);
    } finally {
        await client.close();
    }
};



main();

module.exports = {connectToDatabase}





