const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const menuItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true }
});

const restaurantSchema = new mongoose.Schema({
    RestaurantName: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    Hours: { type: String, required: true },
    price_range: { type: String, required: true },
    menu: { type: [menuItemSchema], default: [] },
    dateAdded: { type: Date, default: Date.now },
    orderUrl: { type: String, required: true } 
}, {
    timestamps: true,
    collection: 'restaurants'
});

restaurantSchema.plugin(AutoIncrement, { inc_field: 'restaurantId' });

module.exports = mongoose.model("Restaurant", restaurantSchema);
