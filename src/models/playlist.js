import { blankImageId } from '../db/google-storage.js'
import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId
    },
    author: {
        type: String,
        required: true
    },
    vids: [{
        type: mongoose.Types.ObjectId,
        ref: 'Video'
    }],
    length: {
        type: Number
    },
    firstVid: {
        type: mongoose.Types.ObjectId,
        ref: 'Video'
    }
}, {
    timestamps: true,
}) 

playlistSchema.index({ owner: 1 })
playlistSchema.index({ createdAt: 1 })

playlistSchema.pre('save', function () {
    const playlist = this

    playlist.length = playlist.vids.length
    
    if (playlist.length > 0) playlist.firstVid = playlist.vids[0] 
    else playlist.firstVid = blankImageId
})

export const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist