import { checkAuth, clearSessVar } from '../../services/sessionStorage'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { styled, alpha } from '@mui/material/styles'
import { Link, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import { logOut } from '../../services/api'
import BarDrawer from './BarDrawer'
import { useState } from 'react'
import {
    AppBar,
    Box,
    Toolbar,
    IconButton, 
    InputBase,
    Menu,
    MenuItem,
} from '@mui/material'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}))

export const SearchBar = () => {
    const [ drawerOpen, setDrawerOpen ] = useState(false)
    const [ anchorEl, setAnchorEl ] = useState(null)
    const isMenuOpen = Boolean(anchorEl)
    const navigate = useNavigate()

    const handleDrawerOpen = (e) => {
        if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return
        }
        
        setDrawerOpen(!drawerOpen)
    }

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleMenuClose = (e) => {
        setAnchorEl(null)
    }

    const handleLogOut = async (e) => {
        try{
            logOut()
            clearSessVar()
            navigate('/home')
        } catch (err) {

        } finally {
            handleMenuClose(e)
        }
    }

    const handleSearch  = async (e) => {
        const search = e.target.value.trim()

        if (e.keyCode === 13 && search) {
            navigate(`/results?q=${encodeURIComponent(search)}&page=0`)
        } 
    }
    
    const menu = () => {
        if (checkAuth()) {
            return (
                <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose} component={Link} to='/profile'>Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to='/upload'>Upload</MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
            )
        } else {
            return (
                <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose} component={Link} to='/signin'>Sign in</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to='/signup'>Sign Up</MenuItem>
                </Menu>
            )
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        sx={{ mr: 2 }}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder='Search...'
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={handleSearch}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                        <IconButton
                            size='large'
                            edge='end'
                            aria-label='account of current user'
                            aria-haspopup='true'
                            onClick={handleMenuOpen}
                            color='inherit'
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            { menu() }
            <BarDrawer open={drawerOpen} clickFunc={handleDrawerOpen}/>
        </Box>
    )
}

export default SearchBar