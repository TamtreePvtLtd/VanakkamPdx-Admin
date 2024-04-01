// OTPVerificationDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { httpWithoutCredentials } from "../services/http";
import { useSnackBar } from "../context/SnackBarContext";

interface OTPVerificationProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onVerifySuccess: () => void; // Callback function for successful OTP verification
}

const OTPVerificationDialog = ({
  open,
  onClose,
  email,
  onVerifySuccess,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const { updateSnackBarState } = useSnackBar();

  const handleVerifyOTP = async (enteredOTP: string, email: string) => {
    try {
      const response = await httpWithoutCredentials.post(
        "/customer/verify-otp",
        { otp: enteredOTP, email }
      );
      if (response.status === 200) {
        console.log("OTP verified successfully");
        updateSnackBarState(true, "OTP verified Successfully", "success");
        onClose();
        onVerifySuccess(); // Call the callback function for successful OTP verification
      } else {
        updateSnackBarState(true, "Failed to send OTP", "error");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify OTP</DialogTitle>
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
          id="otp"
          label="OTP"
          type="text"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleVerifyOTP(otp, email)} color="primary">
          Verify OTP
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPVerificationDialog;
