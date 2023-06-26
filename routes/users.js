// const express from "express";
const express = require("express")
const { deleteUser, dislike, getUser, getAllUsers, like, subscribe, unsubscribe, update, updateActive, updateRole } = require("../controllers/user.js");
const { verifyToken, verifyAdmin } = require("../verifyToken.js");

const router = express.Router()

router.put("/:id",verifyToken, update)

// localhost:8800/api/users/changeRole/6497e45b44745ac1dd2355bf
router.patch("/changeRole/:id",verifyAdmin, updateRole)

// localhost:8800/api/users/changeActive/6497e45b44745ac1dd2355bf
router.patch("/changeActive/:id",verifyAdmin, updateActive)

router.delete("/:id",verifyToken, deleteUser)

// localhost:8800/api/users/find/6475decb5602ff737afc81b6
router.get("/find/:id", getUser)

// localhost:8800/api/users/usersList
router.get("/usersList", verifyAdmin, getAllUsers)

// router.put("/sub/:id",verifyToken, subscribe)
router.put("/sub/:id", subscribe)

// router.put("/unsub/:id",verifyToken, unsubscribe)
router.put("/unsub/:id", unsubscribe)

// router.put("/like/:videoId",verifyToken, like)
router.put("/like/:videoId", like)

// router.put("/dislike/:videoId",verifyToken, dislike)
router.put("/dislike/:videoId", dislike)

module.exports = router