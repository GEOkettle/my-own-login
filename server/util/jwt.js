import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION_TIME,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION_TIME,
} = process.env;

const verifyToken = (type,token) => { 
 try {
     if (type === "access") {

         return jwt.verify(token, JWT_ACCESS_SECRET);
        
   } else if (type === "refresh") {
     return jwt.verify(token, JWT_REFRESH_SECRET);
   }
 } catch (e) {
     if (e.name === "TokenExpiredError") {
  
     return false;
   }
   return false;
 }
}

export default verifyToken