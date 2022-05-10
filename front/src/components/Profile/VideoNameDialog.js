import { Dialog, TextField, Button, Stack, Typography } from "@mui/material";
import { changeVideoName } from "../../services/api";
import { useState } from "react";

export const VideoNameDialog = ({ vidId, open, setOpen, currName, setNewName }) => {
    const [ name, setName ] = useState('')

    const changeName = (e) => setName(e.target.value)
    const handleDialogClose = () =>  setOpen(false)

    const handleConfirm = async () => {
        try {
            await changeVideoName(vidId, name)
            setNewName(name)
            setOpen(false)
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log(err.response)
                return alert('Incorrect name request')
            }
            alert('error updating name please try again soon')
        }
    }

    return (
        <Dialog onClose={handleDialogClose} open={open}>
            <Stack spacing={2} padding={6}>
                <Typography>
                    {`change name for ${currName}`}
                </Typography>
                <TextField 
                    label='Video name'
                    value={name}
                    onChange={changeName}
                />
                <Button onClick={handleConfirm}>Confirm</Button>
            </Stack>
        </Dialog>
    )
}

export default VideoNameDialog