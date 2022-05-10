import { setPlaylistVar, checkAuth, getUsername } from '../../services/sessionStorage'
import { PlaylistCard } from '../../components/Playlists/PlaylistCard'
import { Container, Divider, Grid, Typography } from '@mui/material'
import { getPlaylists } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const AllPlaylists = () => {
    const [ playlists, setPlaylists ] = useState([])
    const [ deletePlaylist, setDeletePlaylist ] = useState(null)
    const navigate = useNavigate()

    const mapPlaylists = (playlist) => {
        return (
            <Grid item xs={6} sm={4} md={3} key={playlist._id}>
                <PlaylistCard
                    playlist={playlist}
                    deleteCallback={setDeletePlaylist}
                />
            </Grid>
        )
    }   

    useEffect(() => {
        if (checkAuth()) {
            getPlaylists().then((playlists) => {
                setPlaylistVar(playlists)
                setPlaylists(playlists.map(mapPlaylists))
            }).catch((err) => {
                console.log(err)
                alert('Error getting Playlists')
                navigate('/home')
            })
        } else {    
            navigate('/home')
        }
    }, [navigate])

    useEffect(() => {
        if (deletePlaylist) {
            for (const playlist in playlists) {
                if (playlists[playlist].key === deletePlaylist) delete playlists[playlist]
            }
            setPlaylists(playlists)
            setDeletePlaylist(null)
        }
    }, [deletePlaylist])

    return (
        <Container>
            <Grid container sx={{ margin: 3 }}>
                <Grid item xs>
                    <Typography variant='h3' >{`${getUsername()}'s playlists`}</Typography> 
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={3}>
                {playlists}
            </Grid>
        </Container>
    )
}

export default AllPlaylists


