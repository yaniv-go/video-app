import { Container, Typography, Divider, Grid, Button } from '@mui/material'
import { getFullPlaylistVids } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import VideoList from '../Videos/VideoList'
import { useEffect, useState } from 'react'

export const Playlist = ({priv, name, id}) => {
    const [ vids, setVids ] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getFullPlaylistVids(id, priv).then((data) => {
            setVids(data)
        }).catch((err) => {
            console.log(err)
            alert('Error retrieving playlist videos')
        })
        
    }, [ id, priv ])

    const handleClick = async (e) => {
        const { _id } = vids.shift()
        navigate(`/video/${_id}`, { state: {vids} })
    }

    return (
        <Container>
            <Grid container sx={{ margin: 2 }}>
                <Grid item xs={8}>
                    <Typography variant='h3'>{name}</Typography>
                    </Grid>
                <Grid item xs={2}><Container /></Grid>
                <Grid item xs={2}>
                    <Button variant='contained' sx={{ margin: 2 }} onClick={handleClick}>Play all</Button>
                </Grid>
            </Grid>
            <Divider></Divider>
            <VideoList vids={vids}/>
        </Container>
    )
} 

export default Playlist