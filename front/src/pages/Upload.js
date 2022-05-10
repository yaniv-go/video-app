import { checkAuth } from '../services/sessionStorage'
import { useRef, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Navigate } from 'react-router-dom'
import { Add } from '@mui/icons-material'
import { upload } from '../services/api'
import ReactPlayer from 'react-player'
import {
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    IconButton,
    Stack,
    LinearProgress,
    Backdrop
} from '@mui/material'

const Input = styled('input')({
    display: 'none'
})

export const Upload = () => {
    const [ videoName, setVideoName ] = useState('')
    const [ selectedFile, setSelectedFile ] = useState('')
    const [ playerURL, setPlayerURL ] = useState(null)
    const [ thumbnailBlob, setThumbnailBlob ] = useState(null)
    const [ thumbURL, setThumbURL ] = useState(null)
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ uploadProg, setUploadProg ] = useState(0)
    const playerEl = useRef(null)

    useEffect(() => {
        if (selectedFile) {
            setPlayerURL(URL.createObjectURL(selectedFile))
        }
        setThumbnailBlob(null)
    }, [ selectedFile ])

    useEffect(() => {
        if (thumbnailBlob) {
            setThumbURL(URL.createObjectURL(thumbnailBlob)) 
        } else {
            setThumbURL(null)
        }
    }, [ thumbnailBlob ])

    const handleUploadProgress = async (pe) => {
        setUploadProg((pe.loaded / pe.total) * 100)
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!videoName) {
            return alert('must provide video name')
        } else if (!thumbnailBlob) {
            return alert('must provide thumbnail')
        } else if (!selectedFile) {
            return alert('must provide video')
        }

        const formData = new FormData()
        formData.append('vid', selectedFile)
        formData.append('video-name', videoName)
        formData.append('thumb', thumbnailBlob)

        try {
            const vid = await upload(formData, handleUploadProgress)
            alert('success')
        } catch (err) {
            console.log(err)
            if (err.error) {
                alert('Error: ' + err.error)
            } else {
                alert('Uknown error')
            }
        } finally {
            setModalOpen(false)
        }
    }
    
    const captureVideoFrame = (e) => {
        const video = playerEl.current.getInternalPlayer()
        if (!video) {
            return
        }
        
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1280
        const MAX_HEIGHT = 720
        var width = video.videoWidth
        var height = video.videoHeight

        if (width > height) {
            if (width > MAX_WIDTH) {
                height = height * (MAX_WIDTH / width);
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width = width * (MAX_HEIGHT / height);
                height = MAX_HEIGHT;
            }
        }

        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(video, 0, 0, width, height)

        canvas.toBlob((blob) => {
            setThumbnailBlob(blob)
        }, 'image/jpeg', 0.92)

    } 

    const handleNameChange = (e) => {
        setVideoName(e.target.value)
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    if (!checkAuth()) {
        return <Navigate to='/' />
    }

    return (
        <Container component='main'>
            <CssBaseline /> 
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography component='h1' variant='h5'>
                    Upload Video
                </Typography>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <TextField 
                            value={videoName}
                            onChange={handleNameChange}
                            margin='normal'
                            label='Video Name'
                            name='videoName'
                            required
                            fullWidth
                            autoFocus
                        />
                        <label htmlFor='icon-button-file'>
                            <Input accept='video/*,.mkv' id='icon-button-file' type='file' name='selectedFile' onChange={handleFileChange}/>
                            <IconButton color='primary' arial-label='upload video ' component='span'>
                                <Add />
                            </IconButton>
                        </label>
                    </Stack>
                    <Stack alignItems='center' spacing={2} width='100%'>
                        <ReactPlayer 
                                url={playerURL}
                                controls={true}
                                ref={playerEl}
                                width='50%'
                                height='50%'
                        />
                        <Box component='img' src={thumbURL} width='50%' height='50%'/>
                    </Stack>
                    <Button 
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                        onClick={captureVideoFrame}
                    >
                        Capture screenshot
                    </Button>
                    <Button
                        fullWidth
                        type='submit'
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                        size='large'
                    >
                        Upload
                    </Button>
                </Box>
            </Box>
            <Backdrop
                open={modalOpen}
            >
                <Box sx={{ backgroundColor: 'white', padding: 5, borderRadius:1 }}>
                    <Typography variant='h6' component='h2'>
                            Upload progress
                    </Typography>
                    <LinearProgress key={uploadProg} variant='determinate' value={uploadProg} sx={{ width: '100%' }}/>
                </Box>
            </Backdrop>
        </Container>
    )   
}

export default Upload