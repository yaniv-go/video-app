import { deleteFile, getFile } from '../db/google-storage.js'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const videoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        required: true,
        default: 0
    },
    ext: {
        type: String,
        required: true
    },
    mime: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    }
}, {
    timestamps: true,
})

videoSchema.index({ name: 'text', author: 'text' })
videoSchema.index({ owner: 1 })
videoSchema.index({ views: 1})

videoSchema.virtual('filename').get(function () {
    const vid = this

    return `${vid._id}.${vid.ext}`
})

videoSchema.virtual('thumb').get(function () {
    const vid = this
    
    return `${vid._id}.${vid.thumbnail}`
})

videoSchema.methods.generateAuthToken = function () {
    const vid = this

    const token = jwt.sign({ _id: vid._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })

    return token
}

const delVids = async function () {
    const vids = await Video.find(this.getFilter())

    for (const vid of vids) {
        try {
            await deleteFile(getFile(`${vid._id}.${vid.ext}`)) 
            await deleteFile(getFile(`${vid._id}.${vid.thumbnail}`)) 
        } catch (err) {
            console.log(err)
        }
    }
}

videoSchema.pre('deleteMany', delVids)

videoSchema.pre('findOneAndDelete', delVids)

videoSchema.options.toJSON = {
    transform (doc, ret, options) {
        delete ret.updatedAt
        delete ret.ext
        delete ret.__v

        return ret
    }
}

const Video = mongoose.model('Video', videoSchema)

export default Video
