import { authUser as auth } from '../middleware/auth.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import express from 'express'
import bcrypt from 'bcryptjs'

export const router = new express.Router()
const { ObjectId } = mongoose.Types

router.post('/api/user', async (req, res) => {
    delete req.body.tokens ; delete req.body.liked ; delete req.body.history
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        res
        .cookie('access_token', token, {
            httpOnly: true
        })
        .status(201)
        .send(user)
    }
    catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({
                errors: {
                    email: { message: 'Duplicate email', kind: 'Duplicate email' }
                }
            })
        }

        res.status(400).send(e)
    }
})

router.post('/api/user/login', async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken(req)

        res
        .cookie('access_token', token, {
            httpOnly: true
        })
        .send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/api/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

        await req.user.save()

        res
        .clearCookie('access_token')
        .send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/api/user/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res
        .clearCookie('access_token')
        .send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/api/user/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/api/user/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: 'Invalid id' })
    
    try {
        const user = await User.findById(req.params.id, 'username createdAt _id')
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/api/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'username', 'age', 'email' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.patch('/api/user/me/password', auth, async (req, res) => {
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    const isMatch = await bcrypt.compare(oldPassword, req.user.password)

    if (!isMatch) {
        return res.status(400).send({ error: 'Invalid password' })
    } else {
        req.user.password = newPassword
        try {
            await req.user.save()
            return res.status(200).send()
        } catch (err) {
            console.log(err)
            return res.status(400).send(err)
        }
    }
})

router.delete('/api/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

export default router