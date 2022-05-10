import { authUser, authVid } from '../middleware/auth.js'
import { parseQuery } from '../utils/parser.js'
import Video from '../models/video.js'
import mongoose from 'mongoose'
import express from 'express'
import busboy from 'busboy'
import { PassThrough } from 'stream'
import { 
    getFile, 
    getSizeAndType, 
    getReadStream, 
    blankImageId, 
    blankImageExt 
} from '../db/google-storage.js'
import { 
    setupUpload, 
    handleWritableEnd, 
    getStreamOptions, 
    getVideoMetadata 
} from '../utils/stream.js'

export const router = new express.Router()
const { ObjectId } = mongoose.Types
const acceptedTypesVideo = [
    'mp4',
    'mkv'
]
const activeTokens = {}
const MIN_WATCH_PERCENT = process.env.MIN_WATCH_PERCENT ? 
        parseInt(process.env.MIN_WATCH_PERCENT) : 
        0.5
const MIN_WATCH_TIME = process.env.MIN_WATCH_TIME ? 
        parseInt(process.env.MIN_WATCH_TIME) : 
        30
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ?
        parseInt(process.env.MAX_FILE_SIZE) :
        50000000

router.post('/api/video', authUser, async (req, res) => {
    const id = new ObjectId()

    const bb = busboy({
        headers: req.headers, 
        limits: {
            fields: 1,
            files: 2,
            fileSize: MAX_FILE_SIZE
        }
    })

    const duration = new PassThrough()
    const filename = { name: '', error: '' }
    const vid = { 
        id, 
        ext: '', 
        mime: '', 
        error: '', 
        writable: null, 
        file: null, 
        touched: false,
        duration 
    }
    const img = { 
        id, 
        ext: '', 
        mime: '', 
        error: '', 
        writable: null, 
        file: null, 
        touched: false 
    }

    bb.on('file', async (name, readable, info) => {
        if (name === 'vid') {
            setupUpload(readable, info, vid, acceptedTypesVideo)
        } else if (name === 'thumb') {
            setupUpload(readable, info, img, [ 'jpeg' ])
        } else {
            readable.resume()
        }
    }).on('field', (name, value, info) => {
        if (name === 'video-name') {
            if (!value) {
                filename.error = 'Invalid Name'
            } else if (value.length > Video.schema.path('name').options.maxlength) {
                filename.error = 'Name cannot be over 100 characters'
            } else { 
                filename.name = value
            }
        }
    }).on('error', (err) => {
        console.log('busboy error')
        console.log(err)
        res.status(500).send()
    }).on('finish', async () => {
        let failed = false

        if (!img.touched) {
            res.status(400).send({ error: 'Must provide thumbnail' })
            failed = true
        } else if (!vid.touched) {
            res.status(400).send({ error: 'Must provide video' })
            failed = true
        } else if (vid.error) { 
            res.status(400).send({ error: vid.error })
            failed = true
        } else if (img.error) {
            res.status(400).send({ error: img.error })
            failed = true
        } else if (filename.error) {
            res.status(400).send({ error: filename.error })
            failed = true
        } else if (!filename.name) {
            res.status(400).send({ error: 'No file name' })
            failed = true
        } else {
            try {
                const metadata = await getVideoMetadata(duration)
                const length = metadata.format.duration
                const vidDoc = await new Video({
                    owner: req.user.id,
                    author: req.user.username,
                    name: filename.name,
                    thumbnail: img.ext,
                    mime: vid.mime,
                    ext: vid.ext,
                    _id: id,
                    length
                }).save()

                res.send(vidDoc)
            } catch (err) {
                console.log(err)
                failed = true
                res.status(500).send(err)
            }
        }

        handleWritableEnd(img, failed)
        handleWritableEnd(vid, failed)
    })

    req.pipe(bb)
}) 

router.get('/api/video/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })
    
    try {
        const vid = await Video.findById({ _id: req.params.id })

        if (!vid) return res.status(404).send()
        
        const token = vid.generateAuthToken()
        activeTokens[token] = { prevPlayedSec: 0, prevTime: Date.now() }

        res
        .cookie('video_token', token, {
            httpOnly: true
        })
        .send(vid)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

router.get('/api/video/:id/stream', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })

    try {
        const vid = await Video.findById({ _id: req.params.id })

        if (!vid) {
            return res.status(404).send()
        }

        const file = getFile(vid.filename) 
        const { contentType, size } = await getSizeAndType(file)
        const range = req.headers.range  

        const {
            status,
            header,
            readOptions
        } = getStreamOptions(range, size, contentType)

        res.writeHead(status, header)
        getReadStream(file, readOptions).pipe(res)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

router.get('/api/video/:id/thumb', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })

    try {
        if (blankImageId === req.params.id) var vid = { thumb: `${blankImageId}.${blankImageExt}` }
        else var vid = await Video.findById({ _id: req.params.id })

        if (!vid) return res.status(404)

        const file = getFile(vid.thumb) 
        const readStream = file.createReadStream()

        readStream.pipe(res)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

router.patch('/api/video/:id', authUser, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })
    
    if (!req.body.name) return res.status(400).send({ error: 'Invalid Updates!'})

    try {
        const vid = await Video.findOne({ _id: req.params.id, owner: req.user })

        if (!vid) return res.status(404).send()

        vid.name = req.body.name
        await vid.save()

        res.send(vid)
    } catch (err) {
        console.log(err)
        if (err.errors) return res.status(400).send(err)
        res.status(500).send()
    }
})

router.patch('/api/video/:id/view', authVid, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })
    
    const token = req.token
    
    if (!req.body.played) {
        return res.status(400).send({ error: 'Invalid Request!' })
    } else if (!activeTokens[token]) {
        return res.send() 
    }

    const { prevPlayed, prevTime } = activeTokens[token]    
    const { played } = req.body
    const { length }  = req.vid
    const currTime = Date.now()

    if ((played - prevPlayed) > (currTime - prevTime)) {
        console.log('Invalid time: added extra')
        delete activeTokens[token]
        res.status(400).send({ error: 'Invalid Request!' })
    } else if (played > length) {
        console.log('Invalid time: more than video')
        delete activeTokens[token]
        res.status(400).send({ error: 'Invalid Request!' })
    } else if (played > MIN_WATCH_TIME || (played / length) > MIN_WATCH_PERCENT) {
        try {
            delete activeTokens[token]
            req.vid.views += 1
            await req.vid.save()
            res.send()
        } catch (err) {
            console.log(err)
            res.status(500).send()
        }
    } else {
        res.send()
    }
})

router.delete('/api/video/:id', authUser, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })

    try {
        const vid = await Video.findOneAndDelete({ _id: req.params.id, owner: req.user })

        if (!vid) return res.status(404).send()

        return res.send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

router.get('/api/videos', async (req, res) => {
    const {
        limit,
        skip,
        sort
    } = parseQuery(req.query)

    const vids = await Video.aggregate([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $unset: ['__v', 'ext', 'updatedAt', 'mime', 'thumbnail']}
    ])

    res.send(vids)
})

router.get('/api/videos/search', async (req, res) => {
    const {
        limit, 
        sort, 
        pattern,
        skip
    } = parseQuery(req.query)

    if (!pattern) return res.status(400).send({ error : 'No search query provided' })

    const vids = await Video.aggregate([
        {
            $match: {
                $or: [
                    { name: { $regex: pattern, $options: 'i' } },
                    { author: { $regex: pattern, $options: 'i' }}
                ]
            }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $unset: ['__v', 'ext', 'updatedAt', 'mime', 'thumbnail']}
    ])

    res.send(vids)
})

router.get('/api/videos/author/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })
    
    const {
        limit, 
        skip,
        sort 
    } = parseQuery(req.query)

    const vids = await Video.aggregate([
        {
            $match: { owner: ObjectId(req.params.id) }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $unset: ['__v', 'ext', 'updatedAt', 'mime', 'thumbnail'] }
    ])

    res.send(vids)
})

export default router