// accessing MongoDB database 
const mdb = require('../backend/mdb.js')

const express = require("express");

const cors = require("cors")
const app = express();
const PORT = 5000;

app.use(cors())
app.use(express.json())

const main = (async () => {
    try {
        
        // connecting to MongoDB database and accessing collections
        const db = await mdb.connectToDatabase()
        
        const usersCollection = db.collection("Users")
        const trainingsCollection = db.collection("Trainings");
        const animalsCollection = db.collection("Animals");
        
        
        // creating user 
        app.post("/users", async (req, res) => {
          const { name, animal} = req.body;
        
          try {
            const user = { name, animal}
        
            // checking is user name is valid 
            for (let i = 0; i < name.length; i++) {
                if (!("qwertyuiopasdfghjklzxcvbnm".includes(name.charAt(i).toLowerCase()))) {
                    return res.status(400).send("Name is invalid");
                }
            }
            // checking if usre already exists
            if (await usersCollection.findOne({ name })) {
                return res.status(500).send("User already exists");
            }

            // adding new user to system
            await usersCollection.insertOne(user);
            res.status(200).send("User successfully created")
        
            } catch (error) {
                return res.status(500).send("User unsuccessfully added")  
            }
        
        
        });

        // creating new training 
        
        app.post("/trainings", async (req, res) => {
            const { animalType, duration, user} = req.body;
        
            const training = { animalType, duration, user }
        
            try {
                
                // checking if animal type exists 
                if (!(await animalsCollection.findOne({animalType}))) {
                    return res.status(400).send("Invalid animal")
                }
                // checking duration of training session
                if (duration < 30 || duration > 120) {
                    return res.status(400).send("Training time is either too long or too short")
                }
                // checking if valid user owns the specified animal 
                if ((!(await usersCollection.findOne({user: user}, {animal: animalType}))) ) {
                    return res.status(400).send("User does not own this animal")
                }
        
                // inserting the new training 
                await trainingsCollection.insertOne(training);
                res.status(200).send("Training successfull added to schedule")
        
            } catch (error) {
                res.status(500).send("Unable to add training to schedule")
            }
        });
        // creating new animal
        app.post("/animals", async (req, res) => {
            const { animalType, animalName, animalAvailable } = req.body;
        
            const animal = { animalType, animalName, animalAvailable }
        
            try {
                // checking if animal name is valid
                for (let i = 0; i < animalName.length; i++) {
                    if (!("qwertyuiopasdfghjklzxcvbnm".includes(animalName.charAt(i).toLowerCase()))) {
                        return res.status(400).send("Name is invalid");
                    }
                }
                if (!(animalAvailable)) {
                    return res.status(400).send("Animal is unavailable")
                }
                // checking if animal is already in system
                if (await animalsCollection.findOne({animalName})) {
                    return res.status(400).send("Animal has already been added")
                }
        
                // inserting animal to collection
                await animalsCollection.insertOne(animal);
                res.status(200).send("Animal was successfully added")
        
            } catch (error) {
                res.status(500).send("Unable to add animal")
            }
        });
        
        
        
        app.get('/api/health', (req, res) => {
            res.json({healthy:true})
        })
        
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        
        })
        
    }
 catch (error) {
    console.log("Unable to connect to database")

} });

main();

