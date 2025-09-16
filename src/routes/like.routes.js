import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";

const router = Router()
router.use(verifyJWT)

router.route("/toggle/video/:videoId").post(toggleVideoLike)
router.route("/toggle/comment/:commentId").post(toggleCommentLike)
router.route("/toggle/tweet/:tweetId").post(toggleTweetLike)
router.route("/get-liked-videos").get(verifyJWT,getLikedVideos)


export default router