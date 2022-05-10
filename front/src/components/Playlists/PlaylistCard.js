import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { getImgURL, deletePlaylist } from '../../services/api'
import { PlaylistNameDialog } from './PlaylistNameDialog'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const PlaylistCard = ({ playlist, deleteCallback }) => {
    const navigate = useNavigate()
    const { _id, name, length, firstVid } = playlist
    const imgURL = getImgURL(firstVid)

    const [ playlistName, setPlaylistName ] = useState(name)
    const [ editDialogFlag, setEditDialogFlag ] = useState(false)

    const handleDelete = async () => {
        try {
            await deletePlaylist(_id)
            deleteCallback(_id)
        } catch(err) {
            console.log(err)
            alert('Error deleting playlist')
        }
    }

    const handleClick = (e) => {
        navigate(`/playlist/${_id}`)
    }

    const handleEditOpen = () => {
        setEditDialogFlag(true)
    }

    return (
        <>
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
                            <Grid item xs>
                                <Typography noWrap variant='body1'>{playlistName}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant='body1' color='text.secondary'>{`${length} videos`}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
                <Grid container>
                    <Grid item xs>
                        <Button 
                            variant='contained' 
                            sx={{ width: 40, margin: 1 }} 
                            onClick={handleEditOpen}
                        >
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant='contained' 
                            color='error' 
                            sx={{ width: 40, margin: 1 }} 
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Grid>`
                </Grid>
            </Card>
            <PlaylistNameDialog 
                PlaylistId={_id} 
                open={editDialogFlag} 
                setOpen={setEditDialogFlag} 
                currName={playlistName}
                setNewName={setPlaylistName}
            />
        </>
    )
}

export default PlaylistCard