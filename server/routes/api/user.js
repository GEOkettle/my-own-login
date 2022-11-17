import express from 'express'
import User from '../../model/User.js'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import bcrypt from 'bcrypt'
const router = express.Router()
import dotenv from "dotenv";
import {saveRftToRedis,deleteRedis} from '../../util/redis.js' 
dotenv.config();
const {
JWT_ACCESS_SECRET,
JWT_REFRESH_SECRET,
JWT_ACCESS_EXPIRATION_TIME,
JWT_REFRESH_EXPIRATION_TIME,
COOKIE_EXPIRATION_TIME,
} = process.env;

router.get(
"/auth",
passport.authenticate("custom", { session: false }),
(req, res,next) => {
//아이거 넥스트로 넘겨야겠다
//req.user는 passport의 done middleware 가 뱉어낸 값 예약 파라메터?
if (req.user.nulltokenmessage) {
//heroku https처리해주니까 배포할떄 secure옵션추가
 //samesite옵션도
res.cookie("refreshToken", null, { httpOnly: true });
return res.json({
isAuth: false,
message: req.user.nulltokenmessage,
});
}

if (req.user.refreshTokenmessage) { 
return res.json({
isAuth: false,
message: req.user.refreshTokenmessage,});
}

if (req.user.refreshToken) {
res.cookie(
  "refreshToken",
  req.user.refreshToken,
  { maxAge: COOKIE_EXPIRATION_TIME },
  { httpOnly: true }
);
}

return res.json({
isAuth: true,
id: req.user.id,
userid: req.user.userid,
role: req.user.role,
accessToken: req.user.accessToken,
});

}
);


router.post("/register", (req, res,next) => {
const user = new User(req.body);
user.save((err, doc) => {
if (!err) { 
return res.status(200).json({
success: true,
userData: doc,
});
}else{
const e = { error: err };
next(e)
}
});
});


router.post("/login", (req, res, next) => {
const { userid, password } = req.body;
  //find email
User.findOne({ userid }).then((user) => {
if (!user)  return next({error: "ID not found",});
//compare password

bcrypt.compare(password, user.password).then((isMatch) => {
if (isMatch) {

const accessPayload = {
id: user.id,
userid: user.userid,
role: user.role,
};

const refreshPayload = {
id: user.id,
userid:user.userid
};  

jwt.sign(
accessPayload,
JWT_ACCESS_SECRET,
{ expiresIn: JWT_ACCESS_EXPIRATION_TIME },
(err, token) => {
if (err) {
err.key = "accessToken generation error"
return next(err)
}
const accessToken = "Bearer " + token;
jwt.sign(refreshPayload,JWT_REFRESH_SECRET,
{ expiresIn: JWT_REFRESH_EXPIRATION_TIME },
(err, refreshT) => {

if (err) {err.key = "refreshToken generation error";
return next(err);};

saveRftToRedis(user.userid, refreshT).then((result) => { console.log('result : '+result)})
res.cookie("refreshToken", refreshT, {maxAge:86400000},{httpOnly: true});
//production에서 secure옵션추가?

return res.json({
isAuth:true,
loginsuccess: true,
accesPayload: accessPayload,
accessToken: accessToken,
role: user.role,
});    

});
})
} else {return next({  error: "Wrong password" }||{ status: false, error: "unknown" });}
});
})
});
router.get("/logout", (req, res, next) => {
//https://velog.io/@yukina1418/JWT%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
//한번 발급한 토큰은 취소를 할 수가없기때문에 엑세스,리프레시 둘다 요청에 받아서 레디스에 쌍으로 만료시간까지 저장하고 인증시 토큰을 토큰이 레디스에
//존재하는지 조회한뒤 진행하는게 가장 이상적이겠으나 일단 배포하고 다음작업이 우선이므로 여기선 쿠키의 리프레시바탕으로 레디스에서지워주는 방법으로 해놓음
// console.log(req.headers.cookie);
const userid = jwt.decode(req.cookies["refreshToken"], { compelete: true }).userid;
deleteRedis(userid).then((result) => {
  if (!result) next({ error: "couldn't logout as couldn't find user" });
  res.cookie("refreshToken", null, { httpOnly: true });
  return res.status(200).json({
    logoutsuccess: true,
  });
});
});


export default router