const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    img: String,
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedUsers: {
        type: [String],
    },
    history: {
        type:[mongoose.ObjectId],
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
    date_created: {
        type: Date, default: Date.now()
    },
    role: {
        type: String, default: "user"
    },
    active: {
        type: Boolean, default: true,
    },
},
    { timestamps: true }
)
exports.UserModel = mongoose.model("users", UserSchema)

exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99),
        img: Joi.string().min(2).max(99).allow(null, ""),
    })

    return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })

    return joiSchema.validate(_reqBody);
}