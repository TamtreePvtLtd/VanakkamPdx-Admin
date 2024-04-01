import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

function Layout() {
  return (
    <>
      <Box>
        <Navbar />
      </Box>
      <Box mb={2}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
