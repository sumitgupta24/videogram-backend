import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"


const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    

})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body

    const userId = req.user?._id;
    
    if(!userId){
        throw new ApiError(404, "User does not exist")
    }
    
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Video does not exist!")
    }

    if(!content.trim()){
        throw new ApiError(404, "Comment something!")
    }

    const comment = await Comment.create({
        content,    
        owner: userId,
        video: videoId
    })

    if(!comment){
        throw new ApiError(401, "Comment couldn't be created")
    }

    const populatedTweet = await Comment.findById(comment._id).populate("owner","username")

    return res.status(200)
    .json(
        new ApiResponse(200, populatedTweet, "Comment added Successfully!!!")
    )


})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id...");
    }

    const newComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if(!newComment){
        throw new ApiError(404, "Failed to add comment")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, newComment, "Comment updated successfully!")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id...");
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new ApiError(404, "Comment couldn't be deleted!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Comment deleted Successfully!")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}