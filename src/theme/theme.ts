import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
   primary: {
      main: "#038265",
    },
    secondary: {
      main: "#efcb6b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "Inter-Regular",
    button: {
      textTransform: "none",
      fontWeight: 600,
      textDecoration: "none",
      color: "white",
    },
    subtitle1: {
      fontWeight: "bold",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: "#57ccb5",
        },
        contained: {
          color: "white",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxHeight: "65vh",
          overflow: "auto",
        },
      },
    },
  },
});

export default theme;
