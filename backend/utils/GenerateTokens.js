import jwt from "jsonwebtoken";
import ENV from "../Config/Env.js"; 

const generateTokens = (payload) => {
  try {
    if (!ENV.ACCESS_SECRET) {
      throw new Error("ACCESS_SECRET is not defined");
    }
    
    const access_token = jwt.sign(payload, ENV.ACCESS_SECRET, {});
    return { access_token };
  } catch (error) {
    console.error("Error generating access token:", error);
    return { access_token: null };
  }
};

export default generateTokens;
