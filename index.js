const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//MIDDLEWARES

app.use(cors());
app.use(express.json());

//CONNECT MONGODB
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.a85bo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//MAIN FUNCTION
async function run() {
    try {
        await client.connect();
        //GETTING DB AND COLLECTION
        const database = client.db('bhromonPoth');
        const destinationCollection = database.collection('destinations');
        const packageCollection = database.collection('packages');
        const bookingCollection = database.collection('bookings');
        //WORK FOR DESTINATION
        //GET ALL DESTINATIONS
        app.get('/destinationlist', async (req, res) => {
            const cursor = destinationCollection.find({});
            const count = await cursor.count();
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let destinatons;
            if (page) {
                destinatons = await cursor.skip(page * size).limit(size).toArray();
            } else {
                destinatons = await cursor.toArray();
            }
            res.send({
                count,
                destinatons
            })
        });
        //ADD NEW DESTINATION
        app.post('/destinationlist', async (req, res) => {
            const destinationData = req.body;
            const result = await destinationCollection.insertOne(destinationData);
            res.json(result);
        });
        //WORK FOR PACKAGE
        //GET ALL PACKAGES
        app.get('/packagelist', async (req, res) => {
            const cursor = packageCollection.find({});
            const count = await cursor.count();
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let packages;
            if (page) {
                packages = await cursor.skip(page * size).limit(size).toArray();
            } else {
                packages = await cursor.toArray();
            }
            res.send({
                count,
                packages
            })
        });
        //ADD NEW PACKAGE
        app.post('/packagelist', async (req, res) => {
            const packageData = req.body;
            const result = await packageCollection.insertOne(packageData);
            res.json(result);
        });

        //WORK FOR USER BOOKINGS
        //GET ALL BOOKINGS
        app.get('/bookinglist', async (req, res) => {
            const cursor = bookingCollection.find({});
            const count = await cursor.count();
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let bookings;
            if (page) {
                bookings = await cursor.skip(page * size).limit(size).toArray();
            } else {
                bookings = await cursor.toArray();
            }
            res.send({
                count,
                bookings
            })
        });
        //ADD NEW BOOKING
        app.post('/bookinglist', async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)














app.get('/', (req, res) => {
    res.send('RUNNING BHROMONPOTH')
});

app.listen(port, () => {
    console.log('BHROMONPOTH on port', port);
})