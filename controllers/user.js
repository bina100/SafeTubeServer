const { createError } = require("../error.js")
const { UserModel } = require("../models/User.js")
const { VideoModel } = require("../models/Video.js")

// localhost:8800/api/users/646f2db95d2b044aac8099a0
const update = async (req, res, next) => {
    if (req.params.id === req.user._id) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            )
            res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can update only your account!"))
    }
}

// localhost:8800/api/users/changeRole/646f2db95d2b044aac8099a0
const updateRole = async (req, res, next) => {
    if (!req.body.role) {
        return res.status(400).json({ msg: "Need to send role in body" });
    }
    try {
        let userID = req.params.id
        if (userID == "6497f02ac52d21a37cdb3443") {
            return res.status(401).json({ msg: "You cant change superadmin to user" });
        }
        let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
        res.json(data);
    }


    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
}

// localhost:8800/api/users/changeActive/646f2db95d2b044aac8099a0
const updateActive = async (req, res, next) => {

    if (!req.body.active && req.body.active != false) {
        return res.status(400).json({ msg: "Need to send active in body" });
    }

    try {
        let userID = req.params.id
        if (userID == "6497f02ac52d21a37cdb3443") {
            return res.status(401).json({ msg: "You cant change superadmin to user" });
        }
        let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
        res.json(data);
    }
    catch (err) {
        return next(createError(500, err))

    }
}



// localhost:8800/api/users/646f2db95d2b044aac8099a0
const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user._id) {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted.")
        } catch (err) {
            next(err)
        }
    } else {
        next(createError(403, "You can delete only your account!"))
    }
}

// localhost:8800/api/users/find/646f2db95d2b044aac8099a0
const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}
// localhost:8800/api/users/usersList
const getAllUsers = async (req, res, next) => {
    try {
        let data = await UserModel.find({}, { password: 0 }).limit(20);
        res.json(data)
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}

// localhost:8800/api/users/sub/646f2db95d2b044aac8099a0
const subscribe = async (req, res, next) => {
    try {
        await UserModel.findByIdAndUpdate(req.body.userId, {
            $push: { subscribedUsers: req.params.id }
        })
        await UserModel.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        })
        res.status(200).json("Subscription successfull.")
    } catch (err) {
        next(err)
    }
}

const unsubscribe = async (req, res, next) => {
    try {
        await UserModel.findByIdAndUpdate(req.body.userId, {
            $pull: { subscribedUsers: req.params.id }
        })
        await UserModel.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })
        res.status(200).json("Unsubscription successfull.")
    } catch (err) {
        next(err)
    }
}

// http://localhost:8800/api/users/like/6475e6f0009bcc3cd72497d5
const like = async (req, res, next) => {
    const id = req.body.userId;
    const videoId = req.params.videoId
    try {
        await VideoModel.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json("The video has been liked.")

    } catch (err) {
        next(err)
    }
}
const dislike = async (req, res, next) => {
    const id = req.body.userId;
    const videoId = req.params.videoId
    try {
        await VideoModel.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("The video has been disliked.")

    } catch (err) {
        next(err)
    }
}

// http://localhost:8800/api/users/history
const addHistory = async (req, res, next) => {
    let videoId = req.body.history
    let video = await VideoModel.findOne({ _id: videoId })
    if (!req.body.history) {
        return res.status(400).json({ msg: "Need to send video id in body" });
    }
    try {
        let data = await UserModel.findByIdAndUpdate(req.tokenData._id, {
            $push: { 'history': video._id }
        })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        return next(createError(500, err))
    }
}

// http://localhost:8800/api/users/history
const getHistory = async (req, res, next) => {
    try {
        let data = await UserModel.findOne({ _id: req.tokenData._id }).populate({ path: 'history', model: 'videos' });
        res.json(data.history)
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}
module.exports = { addHistory, getHistory, update, updateActive, updateRole, deleteUser, getUser, getAllUsers, subscribe, unsubscribe, like, dislike };
