const express = require("express");
const cors = require("cors");
const morgan = require('morgan');


const app = express();
const port = 3000;


const testRoute = require('./routes/test')

app.use(express.json())
app.use(cors());
app.use(morgan("dev"));

app.use(("/"), testRoute);

app.listen(port, () => {
    console.log(`Server has started on port ${port}`)
})


