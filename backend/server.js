
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/user_routes");
const problemRoutes = require("./routes/problem_routes");

const app = express();

// -------------------Middlewares---------------------/
app.use(helmet()); 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//---------------Connecting to Database----------------//
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

//---------------routes-------------------------//
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);



//---------------- starting the server ---------------//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
