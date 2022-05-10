import { Storage } from '@google-cloud/storage'

const storage = new Storage()
export const vidBucket = storage.bucket(process.env.BUCKET_NAME) 
export const blankImageId = '624d5f163417516cd00f1f61'
export const blankImageExt = 'jpeg'
const blank = vidBucket.file(`${blankImageId}.${blankImageExt}`)

if (!(await blank.exists())) {
    await vidBucket.upload('../../public/black.jpeg', { destination: blank })
}

export const getFile = (filename) => {
    return vidBucket.file(filename)
}

export const getWritable = async (file) => {
    return await file.createWriteStream()
}

export const deleteFile = async (file) => {
    return await file.delete()
}

export const getSizeAndType = async (file) => {
    const [ metadata ] = await file.getMetadata()
    const { contentType, size } = metadata

    return { contentType, size }
}

export const getReadStream = (file, readOptions) => {
    return file.createReadStream(readOptions)
}

