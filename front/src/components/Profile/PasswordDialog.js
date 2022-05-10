import { Dialog, TextField, Stack, Button } from '@mui/material'
import { changePassword } from '../../services/api'
import { useState } from 'react'

export const PasswordDialog = ({ open, setOpen }) => {
    const [ oldPassword, setOldPassword ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    
    const nameToSet = { 'oldPassword' : setOldPassword, 'newPassword': setNewPassword }

    const valueChange = (e) => nameToSet[e.target.name](e.target.value) 

    const handleDialogClose = () => setOpen(false)

    const handleConfirm = async () => {
        try {
            await changePassword(oldPassword, newPassword)
            setOpen(false)
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log(err.response)
                return alert('error password must be at least six letters')
            }
            alert('error updating profile please try again')
        }
    }

    return (
        <Dialog onClose={handleDialogClose} open={open}>
            <Stack spacing={2} padding={6}>
                <TextField 
                    name='oldPassword'
                    label='verfiy password'
                    value={oldPassword}
                    onChange={valueChange}
                />
                <TextField 
                    name='newPassword'
                    label='new password'
                    value={newPassword}
                    onChange={valueChange}
                />
                <Button onClick={handleConfirm}>Confirm</Button>
            </Stack>
        </Dialog>
    )
}

export default PasswordDialog