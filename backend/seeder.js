const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Restaurant = require("./models/Restaurant");
const restaurantData = require("./data/restaurants.json");
const userData = require("./data/users.json");
const reviewData = require("./data/reviews.json");
const Users = require("./models/Users");
const Reviews = require("./models/Reviews");
mongoose.connect("mongodb://localhost:27017/CampusEats");

const restaurantIds = [];

const importData = async () => {
    try {
        await Restaurant.deleteMany({});
        await Users.deleteMany({});
        await Reviews.deleteMany({});
        console.log("Deleted all data");

        for (const restaurant of restaurantData) {
            const newRestaurant = new Restaurant(restaurant);
            await newRestaurant.save();
            restaurantIds.push(newRestaurant._id);
        }
        console.log("Added restaurant data");
        for (const user of userData) {
            let counter = 0;
            const newUser = new Users(user);

            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);

            await newUser.save();
            for (const review of reviewData) {
                const newReview = new Reviews(review);
                newReview.user = newUser._id;
                newReview.restaurant = restaurantIds[counter];
                counter++;
                await newReview.save();
            }
        }
        process.exit();
    } catch (e) {
        console.error(`Error ${e}`);
        process.exit(1);
    }
};

const clearData = async () => {
    try {
        await Restaurant.deleteMany({});
        console.log("Deleted restaurant data");
        process.exit();
    } catch (e) {
        console.error(`Error ${e}`);
        process.exit(1);
    }
};
if (process.argv[2] == "-d") {
    clearData();
} else importData();
