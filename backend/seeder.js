const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const restaurantData = require("./data/restaurants.json")
mongoose.connect('mongodb://localhost:27017/CampusEats');


const importData = async () => {
    try {
        await Restaurant.deleteMany({})
        console.log("Deleted restaurant data");

        for (const restaurant of restaurantData) {
            const newRestaurant = new Restaurant(restaurant);
            await newRestaurant.save()
        }
        console.log("Added restaurant data");
        process.exit()
    } catch (e) {
        console.error(`Error ${e}`);
        process.exit(1)
    }

}

const clearData = async () => {
    try {
        await Restaurant.deleteMany({})
        console.log("Deleted restaurant data");
        process.exit()
    } catch (e) {
        console.error(`Error ${e}`);
        process.exit(1)
    }
}
if (process.argv[2] == "-d") {
    clearData();
} else (
    importData()
)



