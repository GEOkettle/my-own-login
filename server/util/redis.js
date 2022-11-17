import Redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_EXPIRATION_TIME
} = process.env;
//* Redis 연결
// redis[s]://[[username][:password]@][host][:port][/db-number]
const redisClient = Redis.createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
  tls: {
    rejectUnauthorized: false,
  },
});
redisClient.on('connect', () => {
   console.info('Redis connected!');
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4; // 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용

export async function saveRftToRedis(id, rft) {
    let bool = await redisCli.set(id, rft); // OK
     await redisCli.expire(id, REDIS_EXPIRATION_TIME); 
    return bool
}



export async function getRftFromRedis(id) {
    let rftFromRedis = await redisCli.get(id); // OK
    if (rftFromRedis) {
        return rftFromRedis
    } else { 
        return false
    }
   
}




export async function deleteRedis(id) {
    const check = await redisCli.exists(id); // true: 1 , false: 0
    let isDeleted;
    if (check) {
         isDeleted = await redisCli.del(id);
    } else {
        isDeleted = false;
    }
    return isDeleted;
}

