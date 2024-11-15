var express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

var app = express();
app.use(cors());

var mongoDB = 'mongodb://127.0.0.1/MyDB';
mongoose.connect(mongoDB).then((data) => {
    console.log("DB Connnection is successful..");
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error'));
app.listen(8001, function (req, res) {
    console.log("Server is listening at http://localhost:8001/insertData");
})
//define the schema
var Schema = mongoose.Schema;
var RestaurantSchema = new Schema({

    "id": Number,
    "name": String,
    "type": String,
    "location": String,
    "rating": Number,
    "topfood": String
});
const RestaurantTable = mongoose.model('Restaurant', RestaurantSchema);

// Get all the employees..
app.get("/getAllRestaurants", function (req, res) {

    RestaurantTable.find().then((data) => {
        console.log(data);
        res.status(200).send(data);
    }).catch((err) => {
        res.status(400).send(err);
    });

});
//for inserting data
// For inserting a record in the table.
app.use(express.json());
app.post("/insertData", async (req, res) => {
    try {
        const { id, name, type, location, rating, topfood } = req.body;
        
        // Check if all fields are provided
        if (!id || !name || !type || !location || rating === undefined || !topfood) {
            return res.status(400).send("All fields (id, name, type, location, rating, topfood) are required.");
        }

        const newRestaurant = new RestaurantTable({ id, name, type, location, rating, topfood });
        await newRestaurant.save();
        res.status(201).send("Record inserted successfully.");
    } catch (err) {
        console.error("Error inserting data:", err.message);
        res.status(400).send(err.message);
    }
});


    /*
        RestaurantObj.save(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result + " Records inserted successfully...");
            }
        });
        */

//1.connecting mongoose with mongodb.
//2.define the schema structure of the collection/table of mongodb
//3.define teh get operation and display the  result in the browser.
// For updating a record in the table.
app.put('/updateRestaurant/:id', async (req, res) => {
    try {
        const RestaurantId = req.params.id;
        const updatedData = {
            name: req.body.name,
            type: req.body.type,

            location: req.body.location,
            rating: req.body.rating,
            topfood: req.body.topfood
        };

        const updatedrestaurant = await RestaurantTable.findOneAndUpdate(
            { id: RestaurantId },
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedrestaurant) {
            return res.status(404).send({ message: "restaurant not found" });
        }

        res.status(200).send({ message: "restaurant record updated successfully", data: updatedrestaurant });
    } catch (err) {
        res.status(400).send({ message: "Error updating restaurant record", error: err.message });
    }
});

//Delete a record based on a condition.
app.delete("/deleteRecord/:id", function (req, res) {
    const { id } = req.params;
    console.log("Given id to delete is: " + id);

    RestaurantTable.deleteMany({ "id": id }).then(function () {
        console.log("Record deleted successfully.");
        res.status(200).send("Record deleted successfully.");
    })
        .catch(function (err) {
            console.error(err);
            res.status(400).send(err);
        });
});