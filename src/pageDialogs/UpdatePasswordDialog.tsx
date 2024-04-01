import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { httpWithoutCredentials } from '../services/http';
import { useSnackBar } from '../context/SnackBarContext';

interface UpdatePasswordDialogProps {
    open: boolean;
    onClose: () => void;
    email: string;
}

const UpdatePasswordDialog = ({ open, onClose, email }:UpdatePasswordDialogProps) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { updateSnackBarState } = useSnackBar();

    const handleUpdatePassword = async () => {
        try {
            await httpWithoutCredentials.post('/customer/update-password', { email, newPassword: password });
            console.log('Password updated successfully');
            onClose();
          updateSnackBarState(true, "Password updated Successfully", "success")
        } catch (error:any) {
            if (error.response && error.response.data) {
                console.log(error.response.data);
                updateSnackBarState(true, error.response.data.message, "error");
            }
    };
}

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Password</DialogTitle>
            <DialogContent>

            <TextField
                    margin="dense"
                    id="email"
                    label="Email"
                    type="text"
                    fullWidth
                    value={email}
                    disabled
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleUpdatePassword} color="primary">
                    Update Password
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default UpdatePasswordDialog;
