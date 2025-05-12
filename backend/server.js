const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const { connectToDatabase } = require('./db');

const app = express();
const port = 3000;

connectToDatabase().catch(console.error);

const reviewRoutes = require('./routes/Reviews');
const testRoute = require('./routes/test')
const usersRoute = require('./routes/Users')
const restaurantsRoute = require("./routes/Restaurants")

app.use(express.json())
app.use(cors());
app.use(morgan("dev"));

app.use("/", testRoute);
app.use("/users", usersRoute);
app.use("/restaurants", restaurantsRoute);
app.use('/restaurants', reviewRoutes);

app.listen(port, () => {
    console.log(`Server has started on port ${port}`)
})


