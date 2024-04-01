import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupCredentials } from "../../services/api";
import { paths } from "../../routes/Paths";
import { ISignUp } from "../../interface/customer";
import { useAuthContext } from "../../context/AuthContext";
import { useSnackBar } from "../../context/SnackBarContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface ISignUpFormFields {
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required()
    .typeError("Please enter the PhoneNumber")
    .matches(/^\d{10}$/, "Please enter a valid 10-digit phone number"),

  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  name: yup.string().required("Please enter Name"),
});

const Signup = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAuthContext();
  const { updateSnackBarState } = useSnackBar();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormFields>({
    resolver: yupResolver(schema) as any,
    mode: "all",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSign = async (data: ISignUpFormFields) => {
    console.log("data", data);
    if (data) {
      setIsLoading(true);
      var signUpFormData = {
        ...data,
      } as ISignUp;
      await SignupCredentials(signUpFormData)
        .then((response) => {
          if (response.data) {
            updateUserData({
              ...response.data,
            });
            navigate(paths.LOGIN);
          }
          updateSnackBarState(true, "Signup Successfully", "success");
        })
        .catch((error: any) => {
          if (error.response && error.response.data) {
            console.log(error.response.data);
            updateSnackBarState(true, error.response.data.message, "error");
          }
        });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      {isLoading != null && !isLoading && (
        <>
          <div style={{ paddingTop: "64px" }}>
            <AppBar
              sx={{
                backgroundColor: "white",
                position: "fixed",
                top: 0,
                zIndex: 9999,
              }}
            >
              <Toolbar>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexGrow: 0,
                  }}
                >
                  <Link
                    to={paths.ROOT}
                    style={{ textDecoration: "none", display: "flex" }}
                  >
                    <img
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "55%",
                        backgroundColor: "white",
                        paddingRight: "1.5px",
                      }}
                      src="assets\images\sindhus-logo.png"
                      alt=""
                    />
                  </Link>
                  <Typography
                    sx={{
                      fontFamily: "Sindhus-Logo-Font",
                      fontWeight: 800,
                      fontSize: "2rem",
                      color: "#57ccb5",
                    }}
                  >
                    SINDHU'S
                  </Typography>
                </Box>
              </Toolbar>
            </AppBar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                marginX: "10px", // Adjust padding top to prevent content from being hidden behind the fixed AppBar
              }}
            >
              <Typography variant="h5" align="center" gutterBottom>
                <b>Register</b>
              </Typography>
              <form onSubmit={handleSubmit(handleSign)}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "300px",
                  }}
                >
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message?.toString() || ""}
                    required
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={
                      (errors.email || (register("email"), true)) &&
                      errors.email?.message
                    }
                    required
                  />
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    type="tel"
                    {...register("phoneNumber")}
                    error={!!errors.phoneNumber}
                    helperText={
                      (errors.phoneNumber || (register("phoneNumber"), true)) &&
                      errors.phoneNumber?.message
                    }
                    required
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={!!errors.password}
                    helperText={
                      (errors.password || (register("password"), true)) &&
                      errors.password?.message
                    }
                    required
                    InputProps={{
                      // Add endAdornment to show/hide password icon
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={
                      (errors.confirmPassword ||
                        (register("confirmPassword"), true)) &&
                      errors.confirmPassword?.message
                    }
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
              <Typography variant="body1" align="center" marginTop={"10px"}>
                Already have an account?{" "}
                <Link to={paths.LOGIN} style={{ textDecoration: "none" }}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </div>
        </>
      )}
    </>
  );
};

export default Signup;
