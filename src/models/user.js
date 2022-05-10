import Playlist from './playlist.js'
import validator from 'validator'
import mongoose from 'mongoose'
import Video from './video.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const { ObjectId } = mongoose.Types

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    password: {
        type: String,
        reuired: true,
        trim: true,
        minlength: 6,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) throw new Error('Email is Invalid')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0) throw new Error('Age must be positive number')            
        }
    },
    liked: {
        type: mongoose.Types.ObjectId,
        ref: 'Playlist'
    },
    disliked: {
        type: mongoose.Types.ObjectId,
        ref: 'Playlist'
    },
    history: {
        type: mongoose.Types.ObjectId,
        ref: 'Playlist'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.options.toJSON = {
    transform(doc, ret, options) {
        delete ret.password 
        delete ret.tokens

        return ret
    }
}

userSchema.pre('save', async function (next) {
    const user = this

    user.usernameModified = user.isModified('username')

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    if (!user.liked) {
        user.liked = ObjectId()
        user.likedFlag = true
    }
    if (!user.history) {
        user.history = ObjectId()
        user.historyFlag = true
    }
    if (!user.disliked) {
        user.disliked = ObjectId()
        user.dislikedFlag = true
    }

    next()
})

userSchema.post('save', async function () {
    const user = this

    if (user.usernameModified) {
        await Video.updateMany({ owner: user._id }, { author: user.username })
        await Playlist.updateMany({ owner: user._id }, { author: user.username })
        delete user.usernameModified
    }

    if (user.likedFlag) {
        const liked = await new Playlist({
            name: 'Liked songs',
            priv: true,
            owner: user._id,
            author: user.username,
            _id: user.liked
        })
        delete user.likedFlag
        liked.save()
    }

    if (user.historyFlag) {
        const history = await new Playlist({
            name: 'History',
            priv: true,
            owner: user._id,
            author: user.username,
            _id: user.history
        })
        delete user.historyFlag
        history.save()
    }

    if (user.dislikedFlag) {
        const disliked = await new Playlist({
            name: 'Disliked',
            priv: true,
            owner: user._id,
            author: user.username,
            _id: user.disliked
        })
        delete user.dislikedFlag
        disliked.save()
    }
})

userSchema.pre('remove', async function () {
    const user = this
    
    await Video.deleteMany({ owner: user._id })
    await Playlist.deleteMany({ owner: user._id })
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to login')

    return user
}

userSchema.methods.generateAuthToken = async function (req) {
    const user = this

    if (req && req.cookies.access_token) {
        const token = req.cookies.access_token
        
        try {
            jwt.verify(token, process.env.JWT_SECRET)
            if (user.tokens.some((t) => t.token === token)) return token            
        } catch (err) {
            user.tokens = user.tokens.filter((t) => t.token !== token)
        }
    }

    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })

    if (user.tokens.length > 9) user.tokens.shift()

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

const User = mongoose.model('User', userSchema)

export default User