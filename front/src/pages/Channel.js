import { Container, Grid, Typography, Button, Divider} from '@mui/material'
import {getFullChannelVids, getChannelInfo } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import VideoList from '../components/Videos/VideoList'
import { useEffect, useState } from 'react'

const Channel = () => {
    const [ vids, setVids ] = useState(null)
    const [ info, setInfo ] = useState({})
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() =>  {
        getChannelInfo(id).then((data) => {
            setInfo(data)
        }).catch((err) => {
            console.log(err)
            alert('Error retrieving channel info')
        })
        getFullChannelVids(id).then((data) => {
            setVids(data)
        }).catch((err) => {
            console.log(err)
            alert('Error retrieving channel videos')
        })
    }, [id])

    const handleClick = async (e) => {
        const allVids = await getFullChannelVids(id)
        const { _id } = allVids.shift()
        navigate(`/video/${_id}`, { state: {vids: allVids} })
    }   

    return (
        <Container>
            <Grid container sx={{margin: 2}}>
                <Grid item xs={8}>
                    <Typography variant='h3'>{info.username}</Typography>
                    </Grid>
                <Grid item xs={2}><Container /></Grid>
                <Grid item xs={2}>
                    <Button variant='contained' sx={{margin: 2}} onClick={handleClick}>Play all</Button>
                </Grid>
            </Grid>
            <Divider />
            <VideoList vids={vids}/>
        </Container>
    )
}

export default Channel