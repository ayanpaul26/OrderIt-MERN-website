//schema is the structure or blue print of the data
//crypto package is used to generate random password tokens when we press forgot password
//jwt is for user token
// bcryptjs is used to hasing the pasword even in database also
//nodemailer for email like welcome email orderconfirm order delivered email etc purpose it is use
//validator is to use validate the user input

const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const { type } = require("os");

//creating schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name !"],
    maxlength: [30, "Name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email here!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Enter the valid email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password here!"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password is not same",
    },
  },

  phoneNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "enter valid Phone Number"], // this line check the given phn no is in between the 0 to 9 in the third bracket
  },

  role: {
    type: String,
    enum:["user","admin"],
    default:"user"
  },
});
