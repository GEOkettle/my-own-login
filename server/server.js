import express from 'express'
import mongoose from 'mongoose'
import user from './routes/api/user.js'
import dotenv from 'dotenv'
import passport from 'passport'
import customPassport from './middleware/passport.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import axios from 'axios'
import { parse, stringify, toJSON, fromJSON } from "flatted";
import path from "path";//이거해줌
dotenv.config()//미들웨어지만 호이스팅이 안되므로 여기에 작성

const { PORT, MONGO_URI} = process.env
 


const app = express();
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({ origin: "https://myownlogin.herokuapp.com", credentials: true })
  );
} else if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
}
app.set("trust proxy", 1);
app.use(express.urlencoded( {extended : false } ));// bodyparser
app.use(express.json()); // bodyparser
app.use(cookieparser())

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("connected to DB");
})
.catch((err) => console.log(err));;

customPassport(passport)



app.use("/api/user", user);
// app.get('/notion',  async (req, res) => {
// //   res.setHeader("Content-Type", "text/event-stream");
// //   res.setHeader("Connection", "keep-alive");
// //     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.writeHead(200, {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       "Access-Control-Allow-Origin": "http://localhost:3000",
//     });
//   let notionData = await axios(
//       `https://notion-api.splitbee.io/v1/page/dsfa-5238c13f4457483594104ea57d2e6e59`
//       )
//       .then((response) => {
//            return response;
//         })
//         .catch((e) => console.log(e));
        
//     console.log(notionData)
//     // console.log(res.write.toString())
//     res.write("data: " + stringify(notionData.data) + "\n\n");
//     res.end()
        
// })
app.use((err, req, res, next) => {
    if (err.message) {
        //토큰생성 등 컨트롤러 error 는 500
        return res.status(500).json({ success: false, error: "controller logic error", message: err.message, key:err.key })
    } else { 
        //유저정보 오기입시는 정상
        return res.json({ success: false, error: err.error});
    }
});
if (process.env.NODE_ENV === "production") {
  // add NODE_ENV : production in your heroku config

  // Set static folder
  app.use(express.static("client/dist"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "client", "dist", "index.html")
    );
  });
}
app.listen(port, () => {
  console.log("server runs at 5000");
});
   
