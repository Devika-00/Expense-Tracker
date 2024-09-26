import dotenv from 'dotenv';


dotenv.config();

const ENV = {
  PORT: process.env.PORT,
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  MONGO_URL: process.env.MONGO_URL,
};

export default ENV;
