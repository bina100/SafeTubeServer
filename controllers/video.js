const { createError } = require("../error")
const { UserModel } = require("../models/User.js")
const { VideoModel } = require("../models/Video.js")

// http://localhost:8800/api/videos
const addVideo = async (req, res, next) => {
    const newVideo = new VideoModel({ userId: req.tokenData._id, ...req.body.data })
    try {
        const savedVideo = await newVideo.save()
        res.status(200).json(savedVideo)
    } catch (err) {
        next(err)
    }
}

const updateVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.id)
        if (!video) {
            return next(createError(404, "Video not found"))
        }
        if (req.user._id === video.userId) {
            const updatedVideo = await VideoModel.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedVideo)
        } else {
            return next(createError(403, "You can update only your video"))
        }
    } catch (err) {
        next(err)
    }
}
const deleteVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.id)
        if (!video) {
            return next(createError(404, "Video not found"))
        }
        if (req.user._id === video.userId) {
            await VideoModel.findByIdAndDeleted(req.params.id, { new: true })
            res.status(200).json("The video has been deleted")
        } else {
            return next(createError(403, "You can delete only your video"))
        }
    } catch (err) {
        next(err)
    }
}
const deleteVideoByVideoUrl = async (req, res, next) => {
    try {
        const video = await VideoModel.deleteOne({ videoUrl: req.params.id })
        if (video.deletedCount <=0) {
            return next(createError(404, "Video not found"))
        }
        if (req.tokenData.role != "safeTubeAdmin") {
            return next(createError(404, "You must be admin to be here ,try log in again"))

            // alert("You must be admin to be here ,try log in again");
        }
        else {
            res.status(200).json("The video has been deleted")
        }
    } catch (err) {
        next(err)
    }
}
const getVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.id)
        res.status(200).json(video)
    } catch (err) {
        next(err)
    }
}
const addView = async (req, res, next) => {
    try {
        const video = await VideoModel.findByIdAndUpdate(req.params.id, {
            $inc: { view: 1 }
        })
        res.status(200).json("The view has been increased")
    } catch (err) {
        next(err)
    }
}
const random = async (req, res, next) => {
    try {
        const videos = await VideoModel.aggregate([{ $sample: { size: 20 } }])
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}

const trend = async (req, res, next) => {
    try {
        const video = await VideoModel.find().sort({ views: -1 })
        res.status(200).json(video)
    } catch (err) {
        next(err)
    }
}

const sub = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)
        const subscribedChannels = user.subscribedUsers;
        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return VideoModel.find({ userId: channelId })
            })
        )
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
        next(err)
    }
}

const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",")
    try {
        const video = await VideoModel.find({ tags: { $in: tags } }).limit(20)
        res.status(200).json(video)
    } catch (err) {
        next(err)
    }
}
const search = async (req, res, next) => {
    const query = req.query.q
    try {
        const video = await VideoModel.find({ title: { $regex: query, $options: "i" } }).limit(40)
        res.status(200).json(video)
    } catch (err) {
        next(err)
    }
}
module.exports = { addVideo, getVideo, updateVideo, deleteVideo, deleteVideoByVideoUrl, addView, trend, random, sub, getByTag, search }