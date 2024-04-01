
import  { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { httpWithoutCredentials } from "../services/http";

import { useSnackBar } from "../context/SnackBarContext";
import UpdatePasswordDialog from "./UpdatePasswordDialog";
import OTPVerificationDialog from "./VerifyOtp";

interface ForgotPasswordForm {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPasswordDialog = ({ open, onClose }) => {
  const { updateSnackBarState } = useSnackBar();
  const [email, setEmail] = useState("");
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [openUpdatePasswordDialog, setOpenUpdatePasswordDialog] =
    useState(false); // State to control opening update password dialog

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSendOTP = async (data: ForgotPasswordForm) => {
    try {
      await httpWithoutCredentials.post("/customer/request-otp", {
        email: data.email,
      });
      console.log("OTP sent successfully");
      setEmail(data.email);
      onClose();
      updateSnackBarState(true, "OTP sent Successfully", "success");
      setOpenVerifyDialog(true);
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            {...register("email")}
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(handleSendOTP)}>Send OTP</Button>
        </DialogActions>
      </Dialog>
      <OTPVerificationDialog
        open={openVerifyDialog}
        onClose={() => setOpenVerifyDialog(false)}
        email={email}
        onVerifySuccess={() => setOpenUpdatePasswordDialog(true)} // Pass a callback to handle successful OTP verification
      />
      {openUpdatePasswordDialog && (
        <UpdatePasswordDialog
          open={openUpdatePasswordDialog}
          onClose={() => setOpenUpdatePasswordDialog(false)}
          email={email}
        />
      )}
    </>
  );
};

export default ForgotPasswordDialog;
