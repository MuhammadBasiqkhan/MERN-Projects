const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorhandler");
const AsyncError = require("../middleware/Catchasyncerrors");
const OrderModel = require("../models/OrderM");
const UserModel = require("../models/userM");
const productModel = require("../models/productM");
const QNAmodel = require("../models/QandAM");



const getAllQuestion = AsyncError(async (req , res , next) => { 
  const productID = req.params.id

  const questions = await QNAmodel.find({ productID }).populate('author');

  if (!questions) {
    return next(new ErrorHandler("Questions not found", 404));
  }

  res.status(200).json({  success: true, questions});
})


const createQuestion = AsyncError(async (req , res , next) => { 
  const productID = req.params.id
 

  const {question} = req.body

  const QNA = await QNAmodel.create({
    question:question,
    author:req.user.id,
    productID:productID
  });

  res.status(201).json({
    success: true,
    QNA,
  });

})

const UpdateQuestion = AsyncError(async (req, res, next) => { 
  const questionId = req.params.id;
  const { question } = req.body;


  const updatedQuestion = await QNAmodel.findByIdAndUpdate(
    questionId,
    { question },
    { new: true, runValidators: true }
  );

  if (!updatedQuestion) {
    return next(new ErrorHandler('Question not found', 404));
  }

  res.status(200).json({
    success: true,
    updatedQuestion,
  });
});



const DeleteQuestion = AsyncError(async (req, res, next) => {
  const questionId = req.params.id;

 
  const deletedQuestion = await QNAmodel.findByIdAndDelete(questionId);

  if (!deletedQuestion) {
    return next(new ErrorHandler('Question not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Question deleted successfully',
  });
});



const getSingleQuestion = AsyncError(async (req , res , next) => { 

    const Questionid = req.params.id;
    const userid = req.user.id

    const question = await QNAmodel.findById(Questionid)
      .populate('author')
      .populate('answers.user'); 

    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }

    let views =  addView(Questionid , userid)

    res.status(200).json({
      success: true,
      question,
      views
    });
})



const addView = async (questID , userid) => {
  const questionId = questID;
  const userId = userid;

  const question = await QNAmodel.findById(questionId);

  if (!question) {
    return next(new ErrorHandler("Question not found", 404));
  }

  if (!question.views.includes(userId)) {
    question.views.push(userId);
  }

  const updatedQuestion =  await question.save();

  

  return updatedQuestion.views.length
  
};


const createAnswers = AsyncError(async (req , res , next) => { 
    const Questionid = req.params.id
 
  const {content} = req.body

  const question = await QNAmodel.findById(Questionid);

  if(!question){
    return next(new ErrorHandler("Question not found", 404))
  }

  question.answers.push({
    content:content,
    user:req.user.id
  })
 
  await question.save();

  res.status(201).json({
    success: true,
    question,
  });
 })



const SearchingQuestion = AsyncError(async (req , res , next) => { 
  const productID = req.params.id;
  const questionContent = req.body.content;

  const questionsByProduct = await QNAmodel.find({ productID });

  if (!questionsByProduct || questionsByProduct.length === 0) {
    return next(new ErrorHandler("No questions found for this product", 404));
  }

  const matchingQuestions = questionsByProduct.filter(q =>
    new RegExp(questionContent, 'i').test(q.question)
  );

  if (matchingQuestions.length === 0) {
    return next(new ErrorHandler("No matching questions found", 404));
  }

  res.status(200).json({
    success: true,
    questions: matchingQuestions,
  });

})


const addLike = AsyncError(async (req, res, next) => {
  const questionId = req.params.id;
  const userId = req.user.id;

  const question = await QNAmodel.findById(questionId);

  if (!question) {
    return next(new ErrorHandler("Question not found", 404));
  }

  if (!question.likes.includes(userId)) {
    question.likes.push(userId);
    question.dislikes = question.dislikes.filter(id => id.toString() !== userId);
  }

  await question.save();

  res.status(200).json({
    success: true,
    likes: question.likes.length,
    dislikes: question.dislikes.length,
  });
});

const addDislike = AsyncError(async (req, res, next) => {
  const questionId = req.params.id;
  const userId = req.user.id;

  const question = await QNAmodel.findById(questionId);

  if (!question) {
    return next(new ErrorHandler("Question not found", 404));
  }

  if (!question.dislikes.includes(userId)) {
    question.dislikes.push(userId);
    question.likes = question.likes.filter(id => id.toString() !== userId);
  }

  await question.save();

  res.status(200).json({
    success: true,
    likes: question.likes.length,
    dislikes: question.dislikes.length,
  });
});


module.exports = {
  getAllQuestion,
  createQuestion,
  getSingleQuestion,
  createAnswers,
  UpdateQuestion,
  DeleteQuestion,
  SearchingQuestion,
  addLike,
  addDislike
};
