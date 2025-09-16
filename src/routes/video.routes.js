import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, updateVideoDetails } from "../controllers/video.controllers.js";


const router = Router()

router.route("/upload-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),verifyJWT,publishAVideo
)
router.route("/get-video/:videoId").get(verifyJWT, getVideoById)
router.route("/update-video/:videoId").patch(verifyJWT, updateVideoDetails)
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)
router.route("/get-all-videos").get(verifyJWT, getAllVideos)




export default router