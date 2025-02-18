import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.model";
// import route from "./routes/index";
import path from "path";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const app = express();

// const corsOptions: cors.CorsOptions = {
//   origin: "http://localhost:5173",
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log("🚀 ~ Database is connected successfully.....");
  })
  .catch((err: Error) => {
    console.error("Failed to sync db: " + err.message);
  });

// Set up the default route
// app.use("/", route);
// Simple route
app.get("/", (req: Request, res: Response) => {
  res.json("Welcome to the server!!");
});

// Importing all the routes
// require("./routes/index");

// Set port and listen for requests
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
