// backend/routes/problemRoutes.js
const express = require("express");
const router = express.Router();
const {
  create_problem,
  get_problems,
  get_problem_by_id,
  update_problem_status,
  get_user_progress
} = require("../controller/problem_controller");
const auth_user = require("../middleware/authuser")


router.post("/create", create_problem);


router.get("/", auth_user, get_problems);

router.get("/progress", auth_user,  get_user_progress)

router.get("/:problemId", auth_user, get_problem_by_id);

router.put("/complete-topic", auth_user,  update_problem_status)



module.exports = router;
