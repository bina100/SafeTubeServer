const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default:0,
    }, 
    tags:{
        type:[String],
        default:[],
    },
    channelTitle:{
        type:String,
        default:"",
    },
    channelImg:{
        type:String,
        default:"",
    },
    likes:{
        type:[String],
        default:[],
    },
    dislikes:{
        type:[String],
        default:[],
    },
    createdAt:{
        type:Date, default:Date.now()
      }
},
    { timestamps: true }
)
exports.VideoModel = mongoose.model("videos", VideoSchema)
