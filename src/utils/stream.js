import { getFile, getWritable, deleteFile } from '../db/google-storage.js'
import { fileTypeFromBuffer } from 'file-type'
import ffmpeg from 'fluent-ffmpeg'
import mime from 'mime'

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ?
        parseInt(process.env.MAX_FILE_SIZE) :
        50000000


export const setupUpload = async (readable, info, obj, acceptedTypes) => {
    obj.mime = info.mimeType 
    obj.ext = mime.getExtension(obj.mime)

    if (!acceptedTypes.includes(obj.ext)) {
        obj.error = 'Invalid file type'
        return readable.resume()
    }

    obj.file = getFile(`${obj.id}.${obj.ext}`)
    obj.writable = await getWritable(obj.file)
    obj.touched = true
    assertTypeThenUpload(readable, obj.writable, obj)
}

export const assertTypeThenUpload = (readable, writable, obj) => {
    var checked = false

    readable.on('data', async (chunk) => {
        if (!checked) {
            checked = true
            const fileType = await fileTypeFromBuffer(chunk)
            if (!fileType.ext === obj.ext) {
                obj.error = 'Invalid file'
                return readable.resume()
            }
        }    
        
        if (obj.duration) obj.duration.write(chunk)
        if (!writable.write(chunk)) readable.pause()
    }).on('error', (err) => {
        obj.error = err
    }).on('limit', () => {
        obj.error = `file over size limit of ${MAX_FILE_SIZE} bytes`
    })

    writable.on('drain', () => {
        readable.resume()
    })
}

export const getVideoMetadata = async (stream) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(stream, (err, meta) => {
            if (err) reject(err)
            resolve(meta)
        })
    })
}

export const handleWritableEnd = async (obj, failed) => {
    if (obj.touched) { 
        obj.writable.end() 
        if (failed) {
            obj.writable.on('finish', async () => await deleteFile(obj.file))
        }
    }
    if (obj.duration) obj.duration.push(null)
}

export const getStreamOptions = (range, size, contentType) => {
    if (range) {
        const reqRange = range.replace(/bytes=/, '').split('-')
        const start = parseInt(reqRange[0], 10)
        const end = reqRange[1] ? parseInt(reqRange[1], 10) : size - 1

        const chunkSize = (end - start) + 1
        const readOptions = { start, end }

        const resHeader = {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType
        }

        return {
            status: 206,
            header: resHeader,
            readOptions
        }
    } else {
        const resHeader = {
            'Accept-ranges': 'bytes',
            'Content-Length': size,
            'Content-Type': contentType
        }

        return {
            status: 200,
            header: resHeader
        }
    }
}