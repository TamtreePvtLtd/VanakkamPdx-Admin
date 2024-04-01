import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip, // Import Tooltip component
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { useAuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { logOut } from "../services/api";
import { useSnackBar } from "../context/SnackBarContext";
import Logout from "@mui/icons-material/Logout";
import { paths } from "../routes/Paths";

const navMenus = [
  {
    label: "Catering Enquiries",
    link: paths.CATERINGENQUIRIES,
  },
  {
    label: "Menus",
    link: paths.MENUS,
  },
  {
    label: "Products",
    link: paths.PRODUCTS,
  },
  {
    label: "Daily Menu",
    link: paths.DININGOUTMENU,
  },
  {
    label: "Specials",
    link: paths.SPECIALS,
  },
];

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user, updateUserData } = useAuthContext();
  const { updateSnackBarState } = useSnackBar();

  const navigate = useNavigate();
  const theme = useTheme();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = async () => {
    await logOut()
      .then((response) => {
        if (response.status) {
          updateUserData(null);
          handleClose();
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data);
          updateSnackBarState(true, error.response.data.message, "error");
        }
      });
  };

  return (
    <>
      <Box>
        <AppBar
          component="nav"
          sx={{
            backgroundColor: "white",
            color: "#038265",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "90%",
              }}
            >
              <img
                src="assets\images\sindhus-logo.png"
                alt="Sindhus-Logo"
                height="50px"
                width="50px"
              />
              <Typography
                sx={{
                  padding: "10px",
                  fontWeight: 800,
                  color: "#038265",
                  fontSize: "2rem",
                  fontFamily: "Sindhus-Logo-Font",
                  cursor: "pointer",
                }}
              >
                SINDHU&#8217;S
              </Typography>
              <Box
                sx={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {navMenus.map((menu, index) => (
                  <Box
                    key={menu.label}
                    sx={{
                      position: "relative",
                      marginRight: index < navMenus.length - 1 ? "20px" : "0",
                    }}
                  >
                    <Link to={menu.link} style={{ textDecoration: "none" }}>
                      <Button
                        sx={{
                          borderRadius: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "large",
                          textTransform: "none",
                          backgroundColor:
                            location.pathname === menu.link
                              ? theme.palette.primary.main
                              : "transparent",
                          color:
                            location.pathname === menu.link ? "white" : "black",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          px={2}
                        >
                          {menu.label}
                        </Box>
                      </Button>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>

            {user && (
              <Box sx={{ marginLeft: "auto" }}>
                <Tooltip title="Logout">
                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: "#038265",
                      }}
                    >
                      {user?.name ? user.name.toUpperCase()[0] : ""}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: 25,
              height: 25,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;
