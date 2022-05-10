import { Playlist } from '../../components/Playlists/Playlist'
import { getPlaylistVar } from '../../services/sessionStorage'
import { useParams } from 'react-router-dom'

export const GeneralPlaylist = () => {
    const { id } = useParams()
    const { name } = getPlaylistVar().find((playlist) => playlist._id === id)

    return (
        <Playlist name={name} id={id} />
    )
}

export default GeneralPlaylist