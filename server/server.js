//used to start the server

const app = require("./app");
const dotenv = require("dotenv");
//load env variables
dotenv.config({ path: "./config/config.env" });

//start server 
//app.listen used to start the server and process.env.nameOfTheVariable for used to env variables that is on env file
app.listen(process.env.PORT, () =>{

    console.log(`Server is Started on PORT: ${process.env.PORT} `)
})