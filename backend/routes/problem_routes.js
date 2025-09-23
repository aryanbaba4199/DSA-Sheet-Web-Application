// backend/routes/problemRoutes.js
const express = require("express");
const router = express.Router();
const {
  create_problem,
  get_problems,
  update_problem,
  delete_problem,
  get_problem_by_id,
} = require("../controller/problem_controller");


router.post("/", create_problem);


router.get("/", get_problems);


router.get("/:problemId", get_problem_by_id);


router.put("/", update_problem);


router.delete("/", delete_problem);

module.exports = router;
