import { Grid, CircularProgress } from '@mui/material'
import VideoCard from './VideoCard'

export const VideoList = ({ vids }) => {
    const mapVids = (vid) => {
        return (
            <Grid item xs={6} sm={4} md={3} key={vid._id}>
                <VideoCard
                    vid={vid}
                />
            </Grid>
        )
    }

    return (
        <Grid container spacing={2} marginTop={1}>
            {
                vids
                ? vids.map(mapVids) 
                : <CircularProgress />
            }
        </Grid>
    )
} 

export default VideoList