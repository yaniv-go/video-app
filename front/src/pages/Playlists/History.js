import { getHistoryId } from "../../services/sessionStorage"
import Playlist from "../../components/Playlists/Playlist"

export const History = () => {
    const id = getHistoryId()

    return (
        <Playlist name='History' id={id} />
    )
} 

export default History