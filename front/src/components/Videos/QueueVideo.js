import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { formatVidLength } from '../../utils/misc'
import { getImgURL } from '../../services/api'
import {  
    Divider,
    Grid,
    Box,
    Typography,
    IconButton,
} from '@mui/material'

export const QueueVideo = ({ vid, changeVid, removeVid }) => {
    const { _id, author, name, length } = vid
    const vidLength = formatVidLength(length)

    return (
        <Box>
            <Divider sx={{ marginTop: 1, marginBottom : 1 }}/>
            <Grid container spacing={2}>
                <Grid 
                    item 
                    md={6}
                    onClick={changeVid} 
                    sx={{ '&:hover': {
                        backgroundColor: 'grey',
                        opacity: [0.9, 0.8, 0.7]
                    }}}
                >
                    <Box 
                        component='img' 
                        src={getImgURL(_id)} 
                        style={{
                            objectFit: 'contain', 
                            objectPosition: 'center', 
                            height: 100,
                            width: 200
                        }}
                    />        
                </Grid>
                <Grid 
                    item 
                    md={4}
                    onClick={changeVid} 
                    sx={{ '&:hover': {
                        backgroundColor: 'grey',
                        opacity: [0.9, 0.8, 0.7]
                    }}}
                >
                    <Box 
                        marginX={1} 
                        maxWidth={200} 
                    >
                        <Typography noWrap paddingBottom={1}>{name}</Typography>
                        <Typography noWrap paddingBottom={1} color='GrayText'>{author}</Typography>
                        <Typography noWrap paddingBottom={1}>{vidLength}</Typography> 
                    </Box>
                </Grid>
                <Grid item md={2}>
                    <IconButton onClick={removeVid}><CancelOutlinedIcon /></IconButton>
                </Grid>
            </Grid>
        </Box>
    )
}

export default QueueVideo