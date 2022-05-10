import Video from '../models/video.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const { TokenExpiredError } = jwt

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token })

        if (!user) throw new Error('Invalid id but valid token')
        
        req.token = token
        req.user = user

        next()
    } catch (err) {
        if (err instanceof TokenExpiredError) { 
            return res.status(401).send({ error: 'Session expired. Please sign in again' })
        }
        res.status(401).send({ error: 'Please authenticate' })
    }
}

export const authVid = async (req, res, next) => {
    try {
        const token = req.cookies.video_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const vid = await Video.findById(decoded._id)

        if (!vid) throw new Error('Invalid id but valid token')

        req.token = token
        req.vid = vid

        next()
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.clearCookie('video_token').status(401).send({ error: 'Session expired reload video' })
        }
        res.clearCookie('video_token').status(401).send({ error: 'Please authenticate ' })
    }
}

export default { authUser, authVid }