import axios from 'axios';

// http://geo-works.herokuapp.com/

const instance = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:5000/',
    
    withCredentials: true,

    //for send http only cookie
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
  }
})

instance.interceptors.request.use(
  (config) => {
    // console.log('axios.js request : ' , config);
    return config
  }, 
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    console.log('axios.js response : ' , res);
    return res
  },
  (error) => {
    return Promise.reject(error);
  }
)
export default instance;