import { addToPlaylist, createPlaylist, removeFromPlaylist } from '../../services/api'
import { appendPlaylist, getPlaylistVar } from '../../services/sessionStorage'
import AddIcon from '@mui/icons-material/Add'
import { useEffect, useState } from 'react'
import {
    Dialog,
    Checkbox,
    List,
    ListItem,
    FormControlLabel,
    Divider,
    DialogTitle,
    IconButton,
    Typography,
    Collapse,
    TextField,
    Stack,
    Button
} from '@mui/material'

export const AddDialog = ({ inPlaylists, open, onClose, vidId }) => {
    const [ playlistFlag, setPlaylistFlag ] = useState({})
    const [ playlists, setPlaylists ] = useState([])
    const [ clicked, setClicked ] = useState(false)
    const [ name, setName ] = useState('')

    useEffect(() => {
        setPlaylistFlag(inPlaylists)
        setPlaylists(getPlaylistVar())
    }, [inPlaylists])

    const nameChange = (e) => {
        setName(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setName(name.trim())

        if (!name) {
            return
        }

        try {
            const { _id } = await createPlaylist(name)
            addToPlaylist(_id, vidId).then(() => {
                alert('added to playlist')
            }).catch((err) => {
                console.log(err)
                alert('error adding to playlist')
            })
            appendPlaylist({ _id, name })
        } catch (err) {
            console.log(err)
            alert('Unkown error creating playlist')
        }

        onClose()
    }

    const handleCheck = (e) => {
        const checked = e.target.checked
        const name = e.target.name

        setPlaylistFlag({
            ...playlistFlag,
            [name]: checked
        })

        if (checked) {
            addToPlaylist(name, vidId).then(() => {
                setPlaylistFlag({
                    ...playlistFlag,
                    [name]: checked
                })      
            })
        } else {
            removeFromPlaylist(name, vidId).then(() => {
                setPlaylistFlag({
                    ...playlistFlag,
                    [name]: checked
                })
            })
        }
    }

    const handleClick = (e) => {
        setClicked(!clicked)
    }

    const mapPlaylists = (playlist) => {
        return (
            <ListItem key={playlist._id}>
                <FormControlLabel 
                    control={<Checkbox />} 
                    label={
                        <Typography paddingRight={2}>{playlist.name}</Typography>
                    }
                    checked={playlistFlag[playlist._id]}
                    name={`${playlist._id}`}
                    onChange={handleCheck}
                />
            </ListItem>
        )
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add to Playlist</DialogTitle>
            <Divider />
            <List>
                { playlists.map(mapPlaylists) }
            </List>
            <Divider />
            <Collapse in={!clicked}>
                <IconButton onClick={handleClick}>
                    <AddIcon />
                    <Typography variant='subtitle1'>New playlist</Typography>
                </IconButton>
            </Collapse>
            <Collapse in={clicked}>
                <Stack component='form' onSubmit={handleSubmit} noValidate sx={{ padding: 1 }}>
                    <TextField 
                        value={name}
                        onChange={nameChange}
                        margin='normal'
                        label='playlist name'
                        name='playlistName'
                        required
                        autoFocus
                    />
                    <Button type='submit' variant='text'>
                        create
                    </Button>
                </Stack>
            </Collapse>
        </Dialog>
    )
}