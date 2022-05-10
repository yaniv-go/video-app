import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { QueueVideo } from './QueueVideo'
import { 
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from '@mui/material'

export const Queue = ({ queue, removeVid }) => {
    const [ queueMap, setQueueMap ] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (queue) setQueueMap(queue.map(mapQueueFunc))
        else setQueueMap(<CircularProgress />)
    }, [ queue ])

    const mapQueueFunc = (vid) => {
        const handleClick = (e) => {
            console.log(queue.slice(queue.indexOf(vid) + 1))
            navigate(`/video/${vid._id}`, { state: {vids: queue.slice(queue.indexOf(vid) + 1) } })
        }

        const handleRemove = () => {
            removeVid(vid)
        }

        return <QueueVideo key={vid._id} vid={vid} changeVid={handleClick} removeVid={handleRemove}/>
    }

    return (
        <Stack direction='column' sx={{ overflow: 'auto', maxHeight: '90%' }}>
            <Typography variant='h6'>Queue</Typography>
            <Divider sx={{marginBottom: 1}}/>
            { queueMap }
        </Stack>
    )

}

export default Queue