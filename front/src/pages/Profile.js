import { PasswordDialog } from '../components/Profile/PasswordDialog'
import { AdminVideoList } from '../components/Profile/AdminVideoList'
import { checkAuth, clearSessVar } from '../services/sessionStorage'
import { getUser, patchUser, deleteUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { 
    Box, 
    Button, 
    Container, 
    Dialog, 
    Divider, 
    Grid, 
    TextField, 
    Typography 
} from '@mui/material'

export const Profile = () => {
    const [ changePasswordFlag, setChangePassswordFlag ] = useState(false)
    const [ deleteProfileFlag, setDeleteProfileFlag ] = useState(false)
    const [ editProfileFlag, setEditProfileFlag ] = useState(false)
    const [ displayName, setDisplayName] = useState('')
    const [ username, setUsername ] = useState('')
    const [ userId, setUserId ] = useState(null)
    const [ email, setEmail ] = useState('')
    const [ age, setAge ] = useState(0)
    
    const nameToSet = { 'username': setUsername, 'email': setEmail, 'age': setAge }
    const navigate = useNavigate()

    useEffect(() => {
        if (checkAuth()) {
            getUser().then(({ username, age, email, _id}) => {
                setUserId(_id)
                setUsername(username)
                setDisplayName(username)
                setAge(age)
                setEmail(email)
            }).catch((err) => {
                alert('error retrieving user information')
                console.error(err)
            })
        } else {
            navigate('/home')
        }
    }, [ navigate ])
    
    const handlePasswordChange = () => setChangePassswordFlag(true)

    const handleDeleteClose = () => setDeleteProfileFlag(false)
 
    const handleDeleteOpen = () => setDeleteProfileFlag(true)

    const handleEdit = () => setEditProfileFlag(true)

    const valueChange = (e) => nameToSet[e.target.name](e.target.value)

    const handleEditConfirm = async () => {
        try {
            await patchUser(username, email, age)
            setDisplayName(username)
            setEditProfileFlag(false)
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log(err.response)
                return alert('error')
            } 
            alert('error updating profile please try again')
        }
    }

    const handleDeleteConfirm = async () => {
        try {
            await deleteUser()
            clearSessVar()
            navigate('/home')
        } catch(err) {
            console.log(err)
            alert('Error deleting profile')
        }
    }

    return (
        <Container>
            <Typography variant='h3'>{`${displayName}\`s profile`}</Typography>
            <Divider sx={{ marginTop: 1, marginBottom: 2.5 }}/>
            <Grid container spacing={2}>
                <Grid item sm={4}>
                    <TextField
                        label='username'
                        name='username'
                        value={username}
                        disabled={!editProfileFlag}
                        onChange={valueChange}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField 
                        label='email'
                        name='email'
                        value={email}
                        disabled={!editProfileFlag}
                        onChange={valueChange}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField 
                        name='age'
                        label='age'
                        value={age}
                        disabled={!editProfileFlag}
                        onChange={valueChange}
                    />            
                </Grid>
                <Grid item sm={4}>
                    {
                        editProfileFlag
                        ? <Button variant='contained' size='medium' onClick={handleEditConfirm}>Confirm</Button>
                        : <Button variant='contained' size='large' onClick={handleEdit}>Edit</Button>
                    }
                </Grid>
                <Grid item sm={4}>
                    <Button variant='contained' size='large' onClick={handlePasswordChange}>Change password</Button>
                </Grid>
                <Grid item sm={4}>
                    <Button variant='contained' size='large' color='error' onClick={handleDeleteOpen}>Delete</Button>
                </Grid>
            </Grid>
            <Typography variant='h4' marginTop={1}>{`${displayName}\`s videos`}</Typography>
            <AdminVideoList userId={userId}/>
            <PasswordDialog open={changePasswordFlag} setOpen={setChangePassswordFlag} />
            <Dialog open={deleteProfileFlag} onClose={handleDeleteClose}>
                <Box padding={6}>
                    <Typography align='center'>Deleting your profile will permanentaly delete</Typography>
                    <Typography align='center' paddingBottom={2}>all videos and playlists are you sure? </Typography>
                    <Grid container>
                        <Grid item xs>
                            <Button variant='contained' size='large' onClick={handleDeleteClose}>Cancel</Button> 
                        </Grid>
                        <Grid item>
                            <Button variant='contained' size='large' color='error' onClick={handleDeleteConfirm}>Delete</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </Container> 
    )
}

export default Profile