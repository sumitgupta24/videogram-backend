import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id;

     if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(404, "Invalid video id...");
    }

    const currLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if(currLike){
        await Like.findByIdAndDelete(currLike?._id)
        return res.status(200)
        .json(
            new ApiResponse(200, {}, "Unliked successfully!")
        )
    }

    const like = await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Liked successfully")
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user?._id;

     if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(404, "Invalid commnet id...");
    }

    const currLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    if(currLike){
        await Like.findByIdAndDelete(currLike?._id)
        return res.status(200)
        .json(
            new ApiResponse(200, {}, "Unliked successfully!")
        )
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: userId
    })

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Liked successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user?._id;

     if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(404, "Invalid tweet id...");
    }

    const currLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if(currLike){
        await Like.findByIdAndDelete(currLike?._id)
        return res.status(200)
        .json(
            new ApiResponse(200, {}, "Unliked successfully!")
        )
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Liked successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}