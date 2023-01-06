const express = require("express");
const router = express.Router();

const TweetsController = require("../controllers/tweets");

router.get("/", TweetsController.Index);
router.post("/", TweetsController.Create);
router.get("/new", TweetsController.New);
router.get("/:id", TweetsController.View);
router.post("/:id", TweetsController.Like);
router.post("/comments/:id", TweetsController.Comment);
/*
router.post("/retweet/:id", TweetsController.Retweet);
router.post("/comments/likes/:id".TweetsController.LikeComment);
router.post("delete/:id", TweetsController.Delete);
*/
module.exports = router;
