import axios from "axios"

export const getVid = async (id) => {
    const req = `/api/video/${id}`
    return (await axios.get(req)).data
}

export const getPlaylists = async () => (await axios.get('/api/playlists')).data

export const removeFromPlaylist = async (playlist, vid) => {
    const req = `/api/playlist/${playlist}/${vid}`
    return await axios.delete(req)
}

export const addToPlaylist = async (playlist, vid) => {
    const req = `/api/playlist/${playlist}/${vid}`
    return await axios.patch(req)
}

export const checkIfInPlaylist = async (playlist, vid) => {
    const req = `/api/playlist/${playlist}/${vid}`
    return (await axios.get(req)).data.includes
}

export const checkAllPlaylists = async (vid) => {
    const req = `/api/playlists/check/${vid}`
    return (await axios.get(req)).data
}

export const createPlaylist = async (name ) => {
    const body = { name }
    return (await axios.post('/api/playlist', body)).data
}

export const signUp = async (values) => {
    try {
        const res = await axios.post('/api/user', values)

        return res.data
    } catch (err) {
        if (err.response) {
            const errors = err.response.data.errors
            throw errors
        } 
        throw err
    }
}

export const logIn = async (values) => {
    try {
        const res = await axios.post('/api/user/login', values)

        return res.data
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Incorrect sign in information')
        }
        throw err
    }
}

export const upload = async (formData, handleUploadProgress=null) => {
    try {
        const res = await axios.post('/api/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: handleUploadProgress
        })

        return res.data
    } catch (err) {
        if (err.response && err.response.status === 400) {
            throw err.response.data
        }
        throw err
    }
}

export const addView = async (vidId, played) => {
    return await axios.patch(`/api/video/${vidId}/view`, { played: played })
}

export const getSearchVids = async (query) => {
    const req = `/api/videos/search?q=${query}`
    return (await axios.get(req)).data
}   

export const getHomeVids = async (page) => {
    const req = `/api/videos`
    return (await axios.get(req)).data
}

export const getFullPlaylistVids = async (id) => {
    const req = `/api/playlist/${id}`
    return (await axios.get(req)).data
}

export const getFullChannelVids = async (id) => {
    const req = `/api/videos/author/${id}`
    return (await axios.get(req)).data
}

export const getChannelInfo = async (id) => {
    const req = `/api/user/${id}`
    return (await axios.get(req)).data
}

export const getVidURL = (id) => {
    return `/api/video/${id}/stream`
}

export const getImgURL = (id) => {
    return `/api/video/${id}/thumb`
}

export const getUser = async () => {
    return (await axios.get('/api/user/me')).data
}

export const logOut = async () => {
    return await axios.post('/api/user/logout')
}

export const patchUser = async (username, email, age) => {
    return await axios.patch('/api/user/me', { username, age, email })
}

export const changePassword = async (oldPassword, newPassword) => {
    return await axios.patch('/api/user/me/password', { oldPassword, newPassword })
}

export const changeVideoName = async (vidId, name) => {
    return await axios.patch(`/api/video/${vidId}`, { name })
}

export const changePlaylistName = async (playlistId, name) => {
    return await axios.patch(`/api/playlist/${playlistId}`, { name })
}

export const deleteVideo = async (vidId) => {
    return await axios.delete(`/api/video/${vidId}`)
}

export const deletePlaylist = async (playlistId) => {
    return await axios.delete(`/api/playlist/${playlistId}`)
}

export const deleteUser = async () => {
    return await axios.delete('/api/user/me')
}