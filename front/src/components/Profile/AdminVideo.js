import { Divider, Grid, Box, Typography, Button } from '@mui/material'
import { getImgURL, deleteVideo } from '../../services/api'
import { VideoNameDialog } from './VideoNameDialog'
import { formatVidLength } from '../../utils/misc'
import { format } from 'date-fns'
import { useState } from 'react'

export const AdminVideo = ({ vid, setDeleteVid }) => {
    const {
        _id, 
        views, 
        name: vidName, 
        length, 
        like, 
        dislike, 
        createdAt
    } = vid
    const [ editNameFlag, setEditNameFlag ] = useState(false)
    const [ name, setName ] = useState(vidName)
    const vidLength = formatVidLength(length)

    const handleEdit = () => setEditNameFlag(true)

    const handleDelete = async () => {
        try {
            await deleteVideo(_id)
            setDeleteVid(_id)
        } catch (err) {
            console.log(err)
            alert('error deleting video')
        }
    }

    return (
        <>
            <Divider sx={{marginTop: 1, marginBottom: 1}}/>
            <Grid  container spacing={1}>
                <Grid item xs={12} md={4}>
                    <Box 
                        component='img' 
                        src={getImgURL(_id)} 
                        style={{ objectFit: 'contain', objectPosition: 'center', height: 130, paddingRight: 2 }}
                        maxWidth={160}
                    />                        
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box marginX={1} maxWidth={'auto'}>
                        <Typography noWrap paddingBottom={1}>{name}</Typography>
                        <Typography paddingBottom={1}>{`${views} views`}</Typography>
                        <Typography>{vidLength}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box marginX={1}>
                        <Typography paddingBottom={1}>{`${like} likes`}</Typography>
                        <Typography paddingBottom={1}>{`${dislike} dislikes`}</Typography>
                        <Typography>{`${format(new Date(createdAt), 'y:mm:dd')}`}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Box marginX={1} sx={{ flexDirection: { md: 'column', xs: 'row' }, display: 'flex' }}>
                        <Button variant='contained' sx={{ width: 90, marginBottom: 2, marginRight: { md: 0, xs: 2 } }} onClick={handleEdit}>Edit</Button>
                        <Button variant='contained' color='error' sx={{ width: 90, marginBottom: { md: 0, xs: 2 } }} onClick={handleDelete}>delete</Button>
                    </Box>
                </Grid>
            </Grid>
            <VideoNameDialog vidId={_id} open={editNameFlag} setOpen={setEditNameFlag} currName={name} setNewName={setName}/>
        </>
    )
}
    
export default AdminVideo