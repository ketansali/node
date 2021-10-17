const express = require("express")
const app = express();
const env = require('dotenv')
env.config()
const mongoose = require("mongoose");
const router = require("./routes/user");

mongoose.connect(`mongodb://${process.env.LOCALHOST}:${process.env.PASS}/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log("Database Connection Successfully");
}).catch((error) => {
    console.log(error);
})
app.use(express.json())
app.use("/api", router)


app.listen(process.env.PORT, () => {
    console.log(`Server is Running on PORT ${process.env.PORT}`);
})