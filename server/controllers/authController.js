const User = require("../models/user");
const ErrorHandeler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");
const cloudinary = require("../config/cloudinary");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//singUp to get the user data

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, passwordConfirm, phoneNumber } = req.body;
  let avatar = [];
  //if avatar is not provided
  if (!req.body.avatar || req.body.avtar === "/images/images.png") {
    avatar = {
      public_id: "default",
      url: "/images/images.png",
    };
  } else {
    const result = await cloudinary.UploadStream(req.body.avatar, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    });
    avatar = {
      public_id: result.public_id,
      url: result.url,
    };
  }

  //creating and saving the data in mongodb as till we are extracting the data from the user

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    avatar,
  });

  sendToken(user, 200, res);
});

//login

exports.login = catchAsyncErrors(async (req, res, next) => {

  const { email, password } = req.body;
  //if(email or pw is notmatched then check)
  if (!email || !password) {
    return next(new ErrorHandeler("Please enter correct details!!", 400));
    //400 means status code that syas any of the feild is not filled completely
  }
  //##findOne## is use to find the email on the DB and ####select### used to select the password of the email that need to be found
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandeler("User Not Found! Please SignUp", 401));
  }

  const isPasswordMatched = await user.correctPassword(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandeler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});
