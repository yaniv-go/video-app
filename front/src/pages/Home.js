import { CircularProgress, Container } from "@mui/material";
import VideoList from "../components/Videos/VideoList";
import { getHomeVids } from '../services/api'
import { useEffect, useState } from "react";

export const Home = () => {
    const [vids, setVids] = useState(null)

    useEffect(() => {
        getHomeVids().then((data) => {
            setVids(data)
        }).catch((err) => {
            console.log(err)
            alert('Error retrieving videos')
        })
    }, [])

    return (
        <Container>
            {
                vids 
                ? <VideoList vids={vids}/>
                : <CircularProgress />
            }
        </Container>
    )
}

export default Home