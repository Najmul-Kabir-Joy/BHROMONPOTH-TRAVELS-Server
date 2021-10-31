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
        const imageCollection = database.collection('galary');
        const mentorsCollection = database.collection('mentors');
        //WORK FOR MENTORS
        //ALL MENTORS
        app.get('/mentors', async (req, res) => {
            const cursor = mentorsCollection.find({});
            const mentors = await cursor.toArray();
            res.send(mentors);
        });
        //APPROVED MENTORS
        app.get('/activementors', async (req, res) => {
            const id = 'ACTIVE';
            const query = { status: id };
            const result = await mentorsCollection.find(query).toArray();
            res.send(result);
        });
        //ADD MENTORS
        app.post('/mentors', async (req, res) => {
            const metorData = req.body;
            const result = await mentorsCollection.insertOne(metorData);
            res.json(result);
        });
        //DELETE MENTOR
        app.delete('/mentors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await mentorsCollection.deleteOne(query);
            res.json(result);
        });
        //UPDATE MENTOR STATUS
        app.put('/mentors/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(update);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: update.status
                }
            };
            const result = await mentorsCollection.updateOne(filter, updateDoc, options)
            res.json(result);


        })
        //WORK FOR GALARY
        //GET ALL PHOTOS
        app.get('/allphotos', async (req, res) => {
            const cursor = imageCollection.find({});
            const photos = await cursor.toArray();
            res.send(photos);
        });
        //ADD NEW PHOTO
        app.post('/allphotos', async (req, res) => {
            const photoData = req.body;
            const result = await imageCollection.insertOne(photoData);
            res.json(result);
        });
        //DELETE A PHOTO
        //DELTE BOOKING
        app.delete('/allphotos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await imageCollection.deleteOne(query);
            res.json(result);
        });
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
        //GET SPECIFIC DESTINATION
        app.get('/destinationlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await destinationCollection.findOne(query);
            res.send(result);
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
        //GET SPECIFIC PACKAGE
        app.get('/packagelist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await packageCollection.findOne(query);
            res.send(user);
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
        //GET BOOKING FOR UPDATE
        app.get('/bookinglist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result);
        });
        //GET USER BOOKINGS
        app.get('/mybookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { uid: id };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });
        //ADD NEW BOOKING
        app.post('/bookinglist', async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);
            res.json(result);
        });
        //UPDATE BOOKING
        app.put('/bookinglist/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: update.name,
                    email: update.email,
                    phone: update.phone,
                    people: update.people,
                    date: update.date,
                    travelingfrom: update.travelingfrom,
                    travelingto: update.travelingto,
                    vaccine: update.vaccine,
                    bookhotel: update.bookhotel,
                    sightseeing: update.sightseeing,
                    returnticket: update.returnticket,
                    packName: update.packName
                }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options)
            res.json(result);
        })
        //DELTE BOOKING
        app.delete('/bookinglist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
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