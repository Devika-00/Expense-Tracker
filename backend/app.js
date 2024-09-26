import express from "express"; 
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cors from "cors";
import ENV from "./Config/Env.js";
import connectDb from "./Config/Connection.js";
import userRoute from "./Routes/userRoutes.js"; 

const app = express();

app.use(morgan("dev"));
app.use(express.json()); 
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api", userRoute);

app.all("*", (req, res, next) => {
  next(new CustomError(`Not found ${req.url}`, 404));
});

const port = ENV.PORT || 5000;

app.listen(port, () => {
  connectDb();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
