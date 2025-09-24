const { userModel }= require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

//---------------- me -------------------------//
exports.user_me = async(req, res)=>{
  try{
    const user = await userModel.findById(req.userId).select("_id, name, email completedProblems completedTopics");
    if(!user){
      return res.status(404).json({success: false, message: "User not found"})
    }
    return res.status(200).json({success: true, data: user})
  }catch(e){
    console.error('Error ')
    return res.status(200).json({success: false, message: e.message})
  }
}


//----------------- login --------------------------//
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "Strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({success: true, message: "Login successful", user: { _id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: err.message });
  }
};


//-------------------sign up -----------------------//
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({ name, email, password: hashedPassword });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "Strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({success: true, message: "Login successful", user: { _id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "Server error" });
  }
};

//---------------------update the user -------------//
exports.update_user = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({success: true, message: "User updated successfully", user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "Server error" });
  }
};

