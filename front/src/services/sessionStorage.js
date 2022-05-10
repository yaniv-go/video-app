const set = sessionStorage.setItem.bind(sessionStorage)
const get = sessionStorage.getItem.bind(sessionStorage)
const clear = sessionStorage.clear.bind(sessionStorage)
const stringify = JSON.stringify.bind(JSON)
const parse = JSON.parse.bind(JSON)

export const getPlaylistVar = () => {
    return parse(get('playlists'))
}

export const setAuthVar = (user) => {
    set('username', user.username)
    set('liked', user.liked)
    set('history', user.history)
    set('disliked', user.disliked)
}

export const setPlaylistVar = (playlists) => {
    set('playlists', stringify(playlists))
}

export const appendQueue = (vid) => {
    const queue = getQueue()
    queue.push(vid)
    setQueue(queue)
}

export const appendPlaylist = (playlist) => {
    const playlists = getPlaylistVar()
    playlists.push(playlist)
    setPlaylistVar(playlists)
}

export const checkAuth = () => {
    if (get('username') && get('liked') && get('history')) return true
    clear()
    return false
}

export const getHistoryId = () => get('history')

export const getLikedId = () => get('liked')

export const getDislikedId = () => get('disliked')

export const getUsername = () => get('username')

export const getQueue = () => parse(get('queue'))

export const setQueue = (queue) => set('queue', stringify(queue)) 

export const clearSessVar = () => clear()