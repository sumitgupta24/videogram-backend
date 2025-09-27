import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, removeVideoFromPlaylist } from "../controllers/playlist.controllers.js";

const router = Router()

router.route("/create-playlist").post(verifyJWT, createPlaylist)
router.route("/add-video/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist)
router.route("/delete-video/:playlistId/:videoId").delete(verifyJWT, removeVideoFromPlaylist)

export default router