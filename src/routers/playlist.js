import { authUser } from '../middleware/auth.js'
import Playlist from '../models/playlist.js'
import Video from '../models/video.js'
import mongoose from 'mongoose'
import express from 'express'

export const router = new express.Router()
const { ObjectId } = mongoose.Types
const { VersionError } = mongoose.Error

router.get('/api/playlists', authUser, async (req, res) => {
    try {
        const playlists = await Playlist.find({ 
            owner: req.user._id, 
            _id: { $nin: [req.user.liked, req.user.history, req.user.disliked] } 
        }, '_id name length firstVid')

        if (!playlists) return res.status(404).send()

        res.send(playlists)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

router.get('/api/playlists/check/:vidId', authUser, async (req, res) => {
    const { vidId } = req.params

    if (!ObjectId.isValid(vidId)) return res.status(400).send({ error: 'Invalid id' })

    try {
        const playlists = await Playlist.find({ 
            owner: req.user._id,
            _id: { $nin: [req.user.history] } 
            }, 'name vids')

        const resObj = {}
        for (const playlist of playlists) {
            resObj[playlist._id] = playlist.vids.includes(vidId)
        }

        res.send(resObj)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

router.get('/api/playlist/:id', authUser, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })

    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id })
        if (!playlist) return res.status(404).send({ error: 'Playlist not found' })

        playlist.vids = playlist.vids.reverse()
        await playlist.populate('vids', '-__v -ext -updatedAt -mime -thumbnail')
        res.send(playlist.vids)
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

router.post('/api/playlist', authUser, async (req, res) => {
    const { name } = req.body

    const playlist = new Playlist({ name, owner: req.user._id, author: req.user.username })

    try {
        await playlist.save()
        res.status(201).send(playlist)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.patch('/api/playlist/:id', authUser, async (req, res) => {
    const { name } = req.body
    const { id } = req.params

    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' })
    if (!name) return res.status(400).send({ error: 'Invalid updates provided' })

    try {
        const playlist = await Playlist.findOne({ _id: id, owner: req.user._id })

        if (!playlist) return res.status(404).send({ error: 'Playlist not found' })

        if (name) playlist.name = name

        await playlist.save()
        res.status(200).send()
    } catch(err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.get('/api/playlist/:id/:vidId', authUser, async (req, res) => {
    const { id, vidId } = req.params

    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid playlist id' })
    else if (!ObjectId.isValid(vidId)) return res.status(400).send({ error: 'Invalid video id' })

    try {
        const playlist = await Playlist.findOne({ _id: id, owner: req.user._id })
        if (!playlist) return res.status(404).send({ error: 'Playlist not found' })
        
        const vid = await Video.findById(vidId)
        if (!vid) return res.status(404).send({ error: 'Video not found' })

        if (playlist.vids.includes(vidId)) res.send({ includes: true })
        else res.send({ includes: false })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.patch('/api/playlist/:id/:vidId', authUser, async (req, res) => {
    const { id, vidId } = req.params

    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid playlist id' })
    else if (!ObjectId.isValid(vidId)) return res.status(400).send({ error: 'Invalid video id' })

    try {
        const playlist = await Playlist.findOne({ _id: id, owner: req.user._id })
        if (!playlist) return res.status(404).send({ error: 'Playlist not found' })
        
        const vid = await Video.findById(vidId)
        if (!vid) return res.status(404).send({ error: 'Video not found' })

        const index = playlist.vids.indexOf(vid._id)
        if (index !== -1) { 
            playlist.vids.splice(index, 1) 
        } else if (req.user.liked.equals(id)){  
            vid.like += 1
            await vid.save()
        } else if (req.user.disliked.equals(id)) {
            vid.dislike += 1
            await vid.save()
        }
        
        playlist.vids.push(vid._id)
        await playlist.save()

        res.status(200).send()
    } catch (err) {
        // react adds to history twice
        if (err instanceof VersionError) { return res.status(200).send() }
        console.log(err)

        res.status(400).send(err)
    }
})

router.delete('/api/playlist/:id/:vidId', authUser, async (req, res) => {
    const { id, vidId } = req.params

    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid playlist id' })
    else if (!ObjectId.isValid(vidId)) return res.status(400).send({ error: 'Invalid video id' })

    try  {
        const playlist = await Playlist.findOne({ _id: id, owner: req.user._id })
        if (!playlist) return res.status(404).send({ error: 'Playlist not found' })

        const vid = await Video.findById(vidId)
        if (!vid) return res.status(404).send({ error: 'Video not found' })

        if (playlist.vids.includes(vidId)) {
            if (req.user.liked.equals(id)) {
                vid.like -= 1
                await vid.save()
            } else if (req.user.disliked.equals(id)) {
                vid.dislike -= 1
                await vid.save()
            }
        }
        
        playlist.vids = playlist.vids.filter((el) => !vid._id.equals(el))
        await playlist.save()

        res.status(200).send()
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.delete('/api/playlist/:id', authUser, async (req, res) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' })

    try {
        const playlist = await Playlist.findOneAndDelete({ _id: id, owner: req.user._id })
        if (!playlist) return res.status(404).send({ error: 'Playlist not found' })

        res.status(200).send()
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

export default router