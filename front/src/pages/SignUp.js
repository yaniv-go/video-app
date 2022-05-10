import { checkAuth, setAuthVar, setPlaylistVar } from '../services/sessionStorage.js'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { signUp, getPlaylists } from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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

export const SignUp = () => {
    const [ usernameError, setUsernameError ] = useState(null)
    const [ passwordError, setPasswordError ] = useState(null) 
    const [ emailError, setEmailError ] = useState(null)
    const [ values, setValues ] = useState({
        email: '',
        password: '',
        username: ''
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
        setEmailError(null)
        setPasswordError(null)
        setUsernameError(null)

        try {
            const user = await signUp(values)
            setAuthVar(user)
            getPlaylists().then((data) => {
                setPlaylistVar(data)
            })
            navigate('/home')
        } catch (err) {
            const { email, password, username } = err
            if (!(email || username || password)) return alert('Unknown Error signing up')
            if (email) setEmailError(email.message)
            if (password) setPasswordError(password.message)
            if (username) setUsernameError(username.message)
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign Up
                </Typography>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
                    <TextField 
                        value={values.username}
                        onChange={valueChange}
                        helperText={usernameError}
                        error={usernameError ? true : false}
                        margin='normal'
                        label='username'
                        name='username'
                        autoComplete='username'
                        required
                        fullWidth
                        autoFocus
                    />
                    <TextField
                        value={values.email}
                        onChange={valueChange}
                        helperText={emailError}
                        error={emailError ? true : false}
                        margin='normal'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        required
                        fullWidth
                    />
                    <TextField
                        value={values.password}
                        onChange={valueChange}
                        helperText={passwordError}
                        error={passwordError ? true : false}
                        margin='normal'
                        label='Password'
                        name='password'
                        type='password'
                        autoComplete='new-password'
                        required
                        fullWidth
                    />
                    <Button
                        sx={{ mt: 3, mb: 2}}
                        type='submit'
                        variant='contained'
                        fullWidth
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs> 
                            <Typography component={Link} to='/signin'>
                                Already have an account? Log in
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default SignUp