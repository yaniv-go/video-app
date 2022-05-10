import { useLocation, useNavigate } from 'react-router-dom'
import Video from '../components/Videos/Video'
import Queue from '../components/Videos/Queue'
import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'

export const VideoPage = () => {
    const [ queue, setQueue ] = useState(null)
    const { state } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (state && state.vids) {
            setQueue(state.vids)
        }
    }, [ state ])

    const handleEnd = () => {
        if (queue && queue.length > 0) {
            const {_id} = queue.shift()
            if (queue.length > 0) navigate(`/video/${_id}`, { state: {queue} })
            else navigate(`/video/${_id}`)
        }
    }

    const handleRemoveQueue = (vidToRemove) => {
        setQueue(queue.filter((vid) => vid !== vidToRemove))
    }   

    const queueGrid = (
        <Grid container>
            <Grid item sm={12} md={7} lg={8}>
                <Video handleEnd={handleEnd}/>
            </Grid>
            <Grid item sm={12} md={5} lg={4}>
                <Queue queue={queue} removeVid={handleRemoveQueue}/>
            </Grid>
        </Grid>
    )

    return (
        <>
            {
                queue 
                ? queueGrid
                : <Video handleEnd={handleEnd}/>
            }
        </>
    )
}

export default VideoPage