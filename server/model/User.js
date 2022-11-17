import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator'
const saltRounds = 10;
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION_TIME,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION_TIME,
} = process.env;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  userid: {
    type: String,
    trim: true,
    unique: 1,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "올바른 이메일형식을 입력해주세요./",
    },
  },
  password: {
    type: String,
    required: true,

    validate: [
      function (password) {
        return (
          password.length >= 8 &&
          password.length <= 20 &&
          /[a-z]/.test(password) &&
          /[A-Z]/.test(password) &&
          /[0-9]/.test(password) &&
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        );
      },
      "비밀번호는 8자리 이상 20자리 이하 영문 대,소문자와 특수문자, 숫자의 조합으로 입력해주세요./",
    ],
  },
  role: {
    type: String,
    enum: ["Admin", "fakeAdmin","User"],
    default: "User",
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
}, { timestamps: true });

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.statics.saveRefreshToken =  function (refreshToken, cb) {
    if (refreshToken) {
        
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    User.findOneAndUpdate(
      { _id: decoded.id },
      { $set: { token: refreshToken, tokenExp: decoded.exp } },
        { new: true }, function (err) { 
            if (err) console.log(err)
        }
    )
   
  }
};


const User = mongoose.model("User", userSchema);
export default User;