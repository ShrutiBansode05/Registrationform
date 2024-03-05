
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");


const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.mu4xugv.mongodb.net/registrationFormDB`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,

});


//Registration Schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    confirmpassword : String
});


//node of registration schema
const Registration = mongoose.model("Registration", registrationSchema);


app.use(bodyParser.urlencoded ({ extended : true }));
app.use(bodyParser.json());


app.get("/",(req, res) => {
    res.sendFile(__dirname + "/registration/registration.html");
})


app.post("/register", async (req, res) => {
    try{
        const{name, email, password, confirmpassword} = req.body;

        const existingUser = await Registration.findOne({email :email});
        if (!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password,
                confirmpassword
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }

        
    }
    catch (error){
        console.log(error);
        res.redirect("error");  
    }
})

app.get("/success", (req, res) => {
    res.sendFile (__dirname+"/registration/success.html");
})

app.get("/error", (req, res) => {
    res.sendFile (__dirname+"/registration/error.html");
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})