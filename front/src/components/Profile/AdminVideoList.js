import { checkAuth } from '../../services/sessionStorage'
import { getFullChannelVids } from '../../services/api'
import { Stack, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AdminVideo } from './AdminVideo'

export const AdminVideoList = ({ userId }) => {
    const [ deleteVid, setDeleteVid ] = useState(null)
    const [ vidsMap, setVidsMap ] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (checkAuth()) {
            if (userId) {
                getFullChannelVids(userId).then((vids) => {
                    setVidsMap(vids.map(mapVids))
                }).catch((err) => {
                    console.log(err)
                    alert('error retrieving user videos')
                })
            }
        } else {
            navigate('/home')
        }
    }, [ navigate, userId ])

    useEffect(() => {
        if (deleteVid) {
            for (const vid in vidsMap) {
                if (vidsMap[vid].key === deleteVid) delete vidsMap[vid]
            }
            setVidsMap(vidsMap)
            setDeleteVid(null)
        }
    }, [ deleteVid ])


    const mapVids = (vid) => {
        return <AdminVideo vid={vid} key={vid._id} setDeleteVid={setDeleteVid}/>
    }

    return (
        <Stack>
            {
                vidsMap
                ? vidsMap
                : <CircularProgress />
            }
        </Stack>
    )
}

export default AdminVideoList 