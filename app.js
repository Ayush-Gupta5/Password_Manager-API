import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import router from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

//Database Connection
connectDB(DATABASE_URL);
app.use(express.json());

app.use("/api/", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
