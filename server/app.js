//configure the express and middleware

//firstly import the packages
// create express app
//                      client => app => route => response
//configure middleware
//middleware is the funtion that runs b/w the req and res
//middileware handels the  all checks like security authentication validity etc..
// req => middleware => Route => res
//exprot the app to use in another folder

const express = require("express");

const app = express();

const cors = require("cors");

app.use(cors()); // to apply middileware
app.use(express.json()); //it allows the server to read the json data send by the client ,so if i delete it then server cant read json req body.

module.exports = app;
