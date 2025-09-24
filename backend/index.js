const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/user_routes");
const problemRoutes = require("./routes/problem_routes");

const app = express();

// -------------------Middlewares---------------------//
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: "https://assignment-frontend-39141625808.asia-south1.run.app", 
    credentials: true,               
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

//---------------Connecting to Database----------------//
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//---------------Routes-------------------------//
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);

//---------------- Starting the server ---------------//
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
