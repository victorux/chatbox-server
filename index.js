const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
// routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");

dotenv.config();

const corsOptions ={
    origin:'https://chabox-server.onrender.com', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

mongoose.connect(
    process.env.MONGO_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {
        console.log("MongoDB Connected!");
    }
)
mongoose.set('strictQuery', true);

// middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// express
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: true, limit: '20mb'}));

// api
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port " + process.env.PORT );
})