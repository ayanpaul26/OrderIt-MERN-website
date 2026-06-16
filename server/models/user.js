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

//creating schema

const userSchema = new mongoose.Schema(
  {
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
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      public_id: String,
      url: String,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true },
);

//hash password functions
//pre("save") => it runs before the data is saved
//ismodified =>to check whether the password is modified or not

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

//password compare function

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//checks whether the user pw changed after the jwt token is created
//if yes , then old token is invalid and user must login again   #treate the token asa ticket
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// custom method the generate jwt token
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { id: this._id }, 
    process.env.JWT_SECRET, 
    {expiresIn: process.env.JWT_EXPIRES}
);
};



module.exports = mongoose.model("User", userSchema)