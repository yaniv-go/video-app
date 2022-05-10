import { getLikedId } from "../../services/sessionStorage"
import Playlist from "../../components/Playlists/Playlist"

export const Liked = () => {
    const id = getLikedId()

    return (
        <Playlist name='Liked Videos' id={id} />
    )
} 

export default Liked