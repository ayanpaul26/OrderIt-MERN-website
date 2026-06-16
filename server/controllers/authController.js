const User = require("../models/user")
const ErrorHandeler = require("../utils/errorHandler")
const cathcAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken = require("../utils/sendToken")
const cloudinary = require("../config/cloudinary")

//singup
