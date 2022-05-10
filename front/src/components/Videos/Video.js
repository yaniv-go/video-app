import { ThumbUp, ThumbDown, PlaylistAdd } from '@mui/icons-material'
import { useParams, Link as RouterLink} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { AddDialog } from './AddDialog'
import ReactPlayer from 'react-player'
import {
    Box,
    Stack,
    Divider,
    Grid,
    Typography,
    IconButton,
    Link,
    Container,
} from '@mui/material'
import { 
    addToPlaylist, 
    getVidURL, 
    removeFromPlaylist, 
    getVid, 
    checkAllPlaylists, 
    addView 
} from '../../services/api'
import { 
    checkAuth, 
    getDislikedId, 
    getHistoryId, 
    getLikedId 
} from '../../services/sessionStorage'

const addOrRemove = (add, remove, id) => {
    if (!add.flag) {
        addToPlaylist(add.id, id).catch((err) => {
            console.log(err)
            alert(`Unknown error while performing ${add.name}`)
        }).then(() => {
            add.setFlag(true)
            add.setAmount(add.amount + 1)
        })
        if (remove.flag) {
            removeFromPlaylist(remove.id, id).catch((err) => {
                console.log(err)
                alert(`Unkwon error while removing ${remove.name}`)
            }).then(() => { 
                remove.setFlag(false)
                remove.setAmount(remove.amount - 1)
            })
        }
    } else {
        removeFromPlaylist(add.id, id).catch((err) => {
            console.log(err)
            alert(`Unkown error while removing ${add.name}`)
        }).then(() => {
            add.setFlag(false)
            add.setAmount(add.amount - 1)
        })
    }
}

export const Video = ({ handleEnd }) => {
    const initialState = {
        createdAt: '',
        views: 0,
        name: '',
        author: '',
        owner: ''
    }
    const [ dialogOpen, setDialogOpen ] = useState(false)
    const [ vid, setVid ] = useState(initialState)
    const [ authFlag, setAuthFlag ] = useState(false)
    const [ likeFlag, setLikeFlag ] = useState(false)
    const [ dislikeFlag, setDislikeFlag ] = useState(false)
    const [ likes, setLikes ] = useState(0)
    const [ dislikes, setDislikes ] = useState(0)
    const [ inPlaylists, setInPlaylists ] = useState({})
    const [ played, setPlayed ] = useState(0)
    const [ seeked, setSeeked ] = useState(0)

    const dislikedId = getDislikedId()
    const likedId = getLikedId()
    const historyId = getHistoryId()
    const { id: vidId } = useParams()
    const vidURl = getVidURL(vidId)

    useEffect(() => {
        var cancel = false

        getVid(vidId).catch((err) => {
            cancel = true
            if (err.response.status === 400) {
                alert('Invalid video please check url')
            } else if (err.response.status !== 404) {
                alert('Unkwon error getting video')
            } else {
                alert('Video not found')
            }
        }).then((data) => {
            if (cancel) return
            
            const { 
                views, 
                createdAt, 
                name, 
                author, 
                owner, 
                like, 
                dislike 
            } = data
            setVid({ views, name, createdAt, author, owner })
            setLikes(like)
            setDislikes(dislike)
        })  
        if (checkAuth() && !cancel) {
            setAuthFlag(true)
            checkAllPlaylists(vidId).then((res) => {
                if (cancel) return
                
                setLikeFlag(res[likedId])
                setDislikeFlag(res[dislikedId])
                delete res[likedId] 
                delete res[dislikedId]
                setInPlaylists(res)
            })
            addToPlaylist(historyId, vidId).catch((err) => {
                if (cancel) return

                console.log(err)
                alert('Unknown Error Adding to history')
            })
        }

        return () => {
            cancel = true
        }
    }, [vidId, dislikedId, historyId, likedId])

    useEffect(() => {
        if (played !== 0 || seeked !== 0) {
            addView(vidId, (played + seeked)).catch((err) => {
                console.log(err)
                alert('Error adding view')
            })
        }
    }, [played])

    const liked = {
        flag: likeFlag,
        setFlag: setLikeFlag,
        id: likedId,
        amount: likes,
        setAmount: setLikes,
        name: 'like'
    }

    const disliked = {
        flag: dislikeFlag,
        setFlag: setDislikeFlag,
        id: dislikedId,
        amount: dislikes,
        setAmount: setDislikes,
        name: 'dislike'
    }

    const handleClose = () => setDialogOpen(false)

    const handleAdd = (e) => setDialogOpen(true)

    const handleLike = (e) => addOrRemove(liked, disliked, vidId)

    const handleDislike = (e) => addOrRemove(disliked, liked, vidId)

    const handleProgress = ({ playedSeconds }) => setPlayed(playedSeconds)

    const handleSeek = (seconds) => setSeeked(seeked + (played - seconds))

    return (
        <Container>
            <Stack 
                divider={<Divider 
                            orientation='horizontal' 
                        />}
            >
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <ReactPlayer 
                        url={vidURl} 
                        controls={true} 
                        onEnded={handleEnd}
                        onProgress={handleProgress}
                        onSeek={handleSeek}
                        width='100%'
                        height={500}
                    />
                </Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} sx={{paddingLeft: 1}}>
                        <Typography variant='h6'>{vid.name}</Typography>   
                    </Grid>
                    <Grid item xs={9}>
                        <IconButton disabled={true}>
                            <Typography color='GrayText'>{`${vid.views} views`}</Typography>
                        </IconButton>
                        <IconButton disabled={true}>
                            {(vid.createdAt) && <Typography color='GrayText'>{format(parseISO(vid.createdAt), 'd MMM, y')}</Typography>}
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton name='like' onClick={handleLike} disabled={!authFlag}>
                            <ThumbUp color={likeFlag ? 'primary' : 'default'}/>
                            <Typography> {likes} </Typography> 
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton name='dislike' onClick={handleDislike} disabled={!authFlag}>
                            <ThumbDown color={dislikeFlag ? 'error' : 'default'}/>
                            <Typography> {dislikes} </Typography> 
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton disabled={!authFlag} onClick={handleAdd}>
                            <PlaylistAdd />
                        </IconButton>
                    </Grid>
                </Grid>
                <Link component={RouterLink} to={`/channel/${vid.owner}`} color={'inherit'} underline='hover' sx={{paddingY: 1, paddingLeft: 1}}>
                    <Typography varaint='subtitle1'>{vid.author}</Typography>
                </Link>
                <></>
            </Stack>
            {(authFlag) && (
            <AddDialog 
                open={dialogOpen} 
                onClose={handleClose} 
                inPlaylists={inPlaylists}
                vidId={vidId}
            />
            )}
        </Container>
    )
}

export default Video