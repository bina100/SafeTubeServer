const express = require("express");
const { addVideo,updateVideo, deleteVideo, deleteVideoByVideoUrl, getVideo,addView,trend, random, sub, getByTag, search} = require("../controllers/video.js");
const { verifyToken, verifyAdmin } = require("../verifyToken.js");

const router = express.Router()

// router.post("/", verifyToken, addVideo)
router.post("/", verifyAdmin, addVideo)
router.put("/:id", verifyToken, updateVideo)
router.delete("/:id", verifyToken, deleteVideo)
router.delete("/delete-video/:id", verifyAdmin, deleteVideoByVideoUrl)
router.get("/find/:id", getVideo)
// router.get("/find/:id", verifyToken, getVideo)
router.put("/view/:id", verifyToken, addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub",verifyToken, sub)
router.get("/tags", getByTag)
router.get("/search", search)

module.exports = router