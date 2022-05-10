import { useNavigate } from 'react-router-dom'
import { getImgURL } from '../../services/api'
import { formatDistanceToNowStrict } from 'date-fns'
import {
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    Typography,
    Grid
} from '@mui/material'

export const VideoCard = ({ vid }) => {
    const navigate = useNavigate()
    const { name, author, _id, views, createdAt } = vid
    const imgURL = getImgURL(_id)
    const viewFormatter = Intl.NumberFormat('en', { notation: 'compact' })
    const timeSince = formatDistanceToNowStrict(new Date(createdAt))

    const handleClick = () => {
        navigate(`/video/${_id}`)
    }

    return (
        <Card>
            <CardActionArea onClick={handleClick}>
                <CardMedia 
                    component='img'
                    image={imgURL}
                    height={130}
                    sx={{ objectPosition: 'center', objectFit: 'contain' }}
                />
                <CardContent>
                    <Grid container>
                        <Grid item xs width='0.6'>
                            <Typography noWrap variant='subtitle2'>{name}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography noWrap variant='subtitle2' color='GrayText'>{author}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs>
                            <Typography noWrap variant='subtitle2'>{`${viewFormatter.format(views)} views`}</Typography>
                        </Grid>             
                        <Grid item>
                            <Typography noWrap variant='subtitle2'>{`${timeSince} ago`}</Typography>
                        </Grid>           
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default VideoCard