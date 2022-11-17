import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import verifyToken from "../util/jwt.js";
import { saveRftToRedis, getRftFromRedis, deleteRedis } from "../util/redis.js";
import passportCustom from "passport-custom";
const CustomStrategy = passportCustom.Strategy;
const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION_TIME,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION_TIME,
} = process.env;

export default (custom) => {
  custom.use(
"custom",
new CustomStrategy(function (req, done) {
const split = req.headers.authorization.split(" ");
const reqAcToken = split[1];
const reqRfToken = req.cookies["refreshToken"];
const isAccessValid = verifyToken("access", reqAcToken);
const isRefreshValid = verifyToken("refresh", reqRfToken);


if (!isAccessValid) {
// console.log("when access token isn't valid or exist.");
//check refresh token is valid
if (isRefreshValid) {
// console.log("when acc is expired but ref is still alive");
getRftFromRedis(isRefreshValid.userid).then((result) => { 

if (result && result === reqRfToken) {
// console.log("redis의 refresh와 쿠키의 refresh가 동일합니다.");
User.findById({ _id: isRefreshValid.id, }, (err, user) => {
if (err) console.log(err)

const Payload = {
id: user.id,
userid: user.userid,
role: user.role,
};
const userInfo = user.toObject();
userInfo.id = user.id.toString();
//사용자편의와 보안을 위해 리프레시도 재발급합니다
jwt.sign({ id: Payload.id,userid :Payload.userid },JWT_REFRESH_SECRET,{ expiresIn: JWT_REFRESH_EXPIRATION_TIME },
(err, refreshToken) => {
if (err) {
    console.log(err);
}
//리프레시로 검증을하려면 쿠키와 레디스에 저장을 해야합니다.
userInfo.refreshToken = refreshToken;
saveRftToRedis(Payload.userid,refreshToken)
}
);
jwt.sign(Payload,JWT_ACCESS_SECRET,{ expiresIn: JWT_ACCESS_EXPIRATION_TIME },
(err, accessToken) => {
if (err) {console.log(err);}
//새로발급받은 엑세스를 전달합니다
userInfo.accessToken = "Bearer " + accessToken;
return done(null, userInfo);
}
);
})
} else {
//공격을받고있을 가능성이 높으니 null을반납하고 사용자에게 비밀번호 변경후 재로그인등의 권고를 합니다.
//서버측도 시크릿키를 변경합니다. 해당아이디의 레디스도 지워버립니다.
const userid = jwt.decode(reqRfToken, {compelete: true}).userid;
getRftFromRedis(userid).then(
(result) => { 
    if(result) deleteRedis(reqRfToken)
}
)

return done(null, {refreshTokenmessage: "somebody's trying to attack your account please change your account",});
}
})
} else {
// console.log("when both token are expired or not valid");
return done(null, { nulltokenmessage: "No token provided" });
}
} else {
//일반적으로 두토큰 모두 맞으면 인증된 상태이지만 서비스키 탈취 및 최악의 가능성을 염두하고 레디스와 리프레시토큰을 한번 더 검사해봅니다
    if (isRefreshValid) {
    //   let Payload = jwt.decode(reqAcToken, { complete: true }).payload
    //   Payload.isAuth = true
    //   console.log(Payload)
    //   return done(null,Payload);
      getRftFromRedis(isRefreshValid.userid)
      .then((tk) => {
    //   console.log("when both taken are valid return user info");
      if (tk === reqRfToken) {
      let Payload = jwt.decode(reqAcToken, { complete: true }).payload
      Payload.isAuth = true
      return done(null,Payload);
      }
      })
      .catch(() => { return done(null, { nulltokenmessage: "somebody's trying to attack your account please change your account" })})
    } else {
//어쩌면 이경우가 오히려 제일 일어나기 힘들지도 모르겠너
// console.log("when access token is valid but refresh token is not");
User.findById(isAccessValid.id).then((user) => {
jwt.sign(
{ id: user.id, userid:user.userid },
JWT_REFRESH_SECRET,
{ expiresIn: JWT_REFRESH_EXPIRATION_TIME },
(err, refreshToken) => {
if (err) {console.log(err);}
user.id = user.id.toString();
user.userid = user.userid.toString();  
user.refreshToken = refreshToken;
saveRftToRedis(user.userid,refreshToken)
return done(null, user);
});
});
}}
})
);
};



