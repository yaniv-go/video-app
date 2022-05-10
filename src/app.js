import express from 'express'
import cookieParse from 'cookie-parser'
import userRouter from './routers/user.js'
import videoRouter from './routers/video.js'
import playlistRouter from './routers/playlist.js'
import * as url from 'url'
import path from 'path'
import './db/mongoose.js'

export const app = express()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(cookieParse())
app.use(express.json())
app.use(userRouter)
app.use(videoRouter)
app.use(playlistRouter)
app.use(express.static(path.resolve(__dirname, '../front/build')))

app.get('/*' , (req, res) => {
    res.sendFile(path.resolve(__dirname, '../front/build', 'index.html'))
})

export default app