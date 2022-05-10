import { checkAuth, setAuthVar, setPlaylistVar } from '../services/sessionStorage.js'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { logIn, getPlaylists } from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material'

export const SignIn = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (checkAuth()) {
            navigate('/home')
        }
    }, [])

    const valueChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const user = await logIn(values)
            setAuthVar(user)
            getPlaylists().then((data) => {
                setPlaylistVar(data)
            })
            navigate('/home')
        } catch (err) {
            if (err.message) return alert(`Error: ${err.message}`)
            console.log(err)
            alert('Unkown error with sign in')
        }   
    }

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField 
                        value={values.email}
                        onChange={valueChange}
                        margin='normal'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        required
                        fullWidth
                        autoFocus
                    />
                    <TextField
                        value={values.password}
                        onChange={valueChange}
                        margin='normal'
                        label='Password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        required
                        fullWidth
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Typography component={Link} to='/signup'>
                                Don't have an account? Sign Up
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default SignIn
