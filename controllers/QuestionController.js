const Question = require('../models/Question');

// Lấy tất cả các câu hỏi
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách câu hỏi', error });
  }
};

module.exports = { getAllQuestions };