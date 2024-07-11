const express = require("express");

const {
  getAllQuestion,
  createQuestion,
  getSingleQuestion,
  createAnswers,
  SearchingQuestion,
  addView,
  addLike,
  addDislike,
  UpdateQuestion,
  DeleteQuestion,
} = require("../controlers/QandAControler");

const { IsAuthenticateduser, authorizedrole } = require("../middleware/auth");
const router = express.Router();

router.route("/QNA/all/:id").get(IsAuthenticateduser, getAllQuestion);
router
  .route("/QNA/CreateQuestion/:id")
  .post(IsAuthenticateduser, createQuestion);
router
  .route("/QNA/SingleQuestion/view/:id")
  .get(IsAuthenticateduser, getSingleQuestion)
  .post(IsAuthenticateduser, createAnswers);

router
.route("/QNA/SearchQuestion/:id")
.post(IsAuthenticateduser , SearchingQuestion)


router.route("/QNA/questions/:id/like").post(IsAuthenticateduser, addLike);
router.route("/QNA/questions/:id/dislike").post(IsAuthenticateduser, addDislike);


router
.route("/QNA/question/:id")
.put(IsAuthenticateduser , UpdateQuestion)
.delete(IsAuthenticateduser , DeleteQuestion)
module.exports = router;
