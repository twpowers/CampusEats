const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const { connectToDatabase } = require('./db');

const app = express();
const port = 3000;

connectToDatabase().catch(console.error);

const testRoute = require('./routes/test')
const usersRoute = require('./routes/Users')

app.use(express.json())
app.use(cors());
app.use(morgan("dev"));

app.use("/", testRoute);
app.use("/users", usersRoute);

app.listen(port, () => {
    console.log(`Server has started on port ${port}`)
})


