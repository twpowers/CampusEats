const mongoose = require('mongoose');
const Restruant = require('./models/Restruant');
const restruntData = require("./data/restaurants.json")
mongoose.connect('mongodb://localhost:27017/CampusEats');


const importData = async () => {
    try {
        await Restruant.deleteMany({})
        console.log("Deleated restruant data");

        await Restruant.insertMany(restruntData);
        console.log("Added restrturant data");
        process.exit()
    } catch (e) {
        console.error(`Error ${e}`);
        process.exit(1)
    }

}

if (process.argv[2] == "-d") {

} else (
    importData()
)



