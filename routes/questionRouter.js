const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/QuestionController");

router.get("/all", QuestionController.getAllQuestions);


module.exports = router;
