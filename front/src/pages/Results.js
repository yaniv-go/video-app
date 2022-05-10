import { CircularProgress, Container } from '@mui/material'
import VideoList from '../components/Videos/VideoList'
import { useSearchParams } from 'react-router-dom'
import { getSearchVids } from '../services/api'
import { useEffect, useState } from 'react'

export const Result = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [vids, setVids] = useState(null)
    const query = searchParams.get('q')
    
    useEffect(() => {
        getSearchVids(query).then((data) => {
            setVids(data)
        }).catch((err) => {
            console.log(err)
            alert('Error retrieving search results')
        })
    }, [ query ])

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

export default Result