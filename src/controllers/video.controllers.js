import mongoose, {isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js "
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken"
import { Video } from "../models/video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    if(!userId || (mongoose.Types.ObjectId.isValid(userId.toString()))){
        throw new ApiError(404, "User not found")
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    const isUser = req.user._id;
    if (!isUser) {
        throw new ApiError(404, "user not found");
    }

    if(!title || !description){
        throw new ApiError(401, "Title and Description is mandatory")
    }

    const videoLocalPath = req.files?.videoFile?.[0].path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;


    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video and thumbnail is required!")
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video){
        throw new ApiError(400, "Unable to upload the video, try again!")
    }

    const videoDetails = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
        owner: isUser
    })

    if(!videoDetails){
        throw new ApiError(404, "Something went wrong while registering the video")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, videoDetails, "Video uploaded successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log(videoId)

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Video does not exist!")
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails"
        },
        {
            $project: {
                username: "$ownerDetails.username",
                thumbnail: 1,
                description: 1,
                title: 1,
                views: 1,
                duration: 1,
                videoFile: 1
            }
        }
    ])

    if(!video){
        throw new ApiError(404, "Video not found!")
    }
    console.log(video)
    return res.status(200)
    .json(
        new ApiResponse(200, video, "!!!Video Fetched Successfully!!!")
    )
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body

    if(!title || !description){
        throw new ApiError(401, "Title and Description is required!")
    }

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(404, "Video does not exist")
    }

    const updateVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description
            }
        },
        {
            new: true
        }
    )

    if(!updateVideo){
        throw new ApiError(404, "Video details couldn't be updated")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, updateVideo, "Video details updated successfully!!")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(404, "Video does not exist")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if(!video){
        throw new ApiError(402, "Video couldn't be deleted")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Video Deleted Successfully!")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}