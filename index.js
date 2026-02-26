const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout')


const app = express()
require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optoinSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);


mongoose.connect(process.env.MONGODB_STRING)

mongoose.connection.once('open', () => {
    console.log("Now connected to MongoDB Atlas");
});

if(require.main === module){
    app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`))
}

module.exports = { app, mongoose };