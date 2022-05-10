
import LibraryIcon from '@mui/icons-material/VideoLibrary'
import { checkAuth } from '../../services/sessionStorage'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import HistoryIcon from '@mui/icons-material/History'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate } from 'react-router-dom'
import {
    Drawer,
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material'

export const BarDrawer = (props) => {
    const navigate = useNavigate()

    const handleHome = (e) => navigate('/home')
    const handleMyLibrary = (e) => navigate('/playlists')
    const handleLiked = (e) => navigate('/liked')
    const handleHistory = (e) => navigate('/history')
    const authFlag = !checkAuth()

    return (
        <Drawer
            anchor='left'
            open={props.open}
            onClose={props.clickFunc}
        >
            <Box
                sx={{ width: 250 }}
                role='presentation'
                onClick={props.clickFunc}
            >
                <List>
                    <ListItemButton onClick={handleHome}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Home
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={handleMyLibrary} disabled={authFlag}>
                        <ListItemIcon>
                            <LibraryIcon />
                        </ListItemIcon>
                        <ListItemText>
                            My Playlists
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={handleLiked} disabled={authFlag}>
                        <ListItemIcon>
                            <ThumbUpIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Liked videos
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={handleHistory} disabled={authFlag}>
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText>
                            History
                        </ListItemText>
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    )
}

export default BarDrawer