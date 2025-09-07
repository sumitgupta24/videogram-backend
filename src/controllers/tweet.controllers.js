import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import {asyncHandler} from "../utils/asyncHandler.js";
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const createTweet = asyncHandler(async (req, res) => {
    const {content}  = req.body
    const userId = req.user?._id;
    
    if(!userId){
        throw new ApiError(404, "User does not exist")
    }

    if(!content.trim()){
        throw new ApiError(401, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: userId
    })

    if(!tweet){
        throw new ApiError(500, "Tweet did not get created")
    }

    const populatedTweet = await Tweet.findById(tweet._id).populate("owner","username")

    return res.status(200)
    .json(
        new ApiResponse(200, populatedTweet, "Tweet created!")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(404, "user not found")
    }

    const tweet = await Tweet.aggregate([
        {
            $match: {owner: new mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "tweets"
            }
        },
        {
            $unwind: "$tweets"
        },
        {
            $project: {
                username: "$tweets.username",
                createdAt: 1,
                updatedAt: 1,
                content: 1
            }
        }
    ])

    if(!tweet){
        throw new ApiError(400, "tweet not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet fetched successfully!")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const {content} = req.body

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if(!tweet){
        throw new ApiError(400, "Tweet not found!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet updated Successfully!")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId}  = req.params;

    if(!tweetId){
        throw new ApiError(400, "Incorrect tweetid")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Tweet Deleted Successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}