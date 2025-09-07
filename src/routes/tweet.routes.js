import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/getTweet").get(verifyJWT, getUserTweets)
router.route("/update-tweet/:tweetId").put(updateTweet)
router.route("/delete-tweet/:tweetId").delete(deleteTweet)
export default router