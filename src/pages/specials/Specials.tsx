import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useGetSpecials, useDeleteSpecial } from "../../customRQHooks/Hooks";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import SpecialsDrawer from "../../pageDrawers/SpecialsDrawer";

function SpecialsPage() {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullscreenImageOpen, setFullscreenImageOpen] = useState(false);
  const { data: imagePreviews, isLoading, refetch } = useGetSpecials();
  const deleteSpecial = useDeleteSpecial();

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleDeleteDialogOpen = (index) => {
    setDeleteConfirmationIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmationIndex(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmationIndex !== null) {
      deleteSpecial.mutate({ id: deleteConfirmationIndex });
    }
    handleDeleteDialogClose();
  };

  const handleDeleteAllDialogOpen = () => {
    setDeleteAllDialogOpen(true);
  };

  const handleDeleteAllDialogClose = () => {
    setDeleteAllDialogOpen(false);
  };

  const handleDeleteAll = () => {
    handleDeleteAllDialogClose();
    if (imagePreviews?.data) {
      imagePreviews.data.forEach((preview) => {
        deleteSpecial.mutate({ id: preview._id });
      });
    }
    refetch();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setFullscreenImageOpen(true);
  };

  const handleCloseFullscreenImage = () => {
    setSelectedImage(null);
    setFullscreenImageOpen(false);
  };

  return (
    <Box sx={{ marginLeft: "40px", marginRight: "40px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
          marginTop: "50px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.3rem",
            borderRadius: "50px",
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-start",
            marginRight: "42%",
          }}
        >
          Special Offers
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={handleDeleteAllDialogOpen}
          sx={{ color: "#038265", marginRight: "33%" }}
        >
          Delete All
        </Button>
        <Button variant="contained" color="primary" onClick={handleDrawerOpen}>
          <AddIcon /> Add Specials
        </Button>
      </Box>

      <Box marginTop="5px" style={{ overflowY: "auto" }}>
        <TableContainer>
          <Table aria-label="simple-table">
            <TableHead
              sx={{
                backgroundColor: "#038265",
                color: "white",
                position: "sticky",
                top: 0,
              }}
            >
              <TableRow>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "20%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "white" }}
                  >
                    Image
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      color: "white",
                      justifyContent: "flex-start",
                    }}
                  >
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "white" }}
                  >
                    Created At
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "white" }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!isLoading &&
                imagePreviews?.data &&
                imagePreviews?.data.map((preview, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={preview.images[0]}
                        alt={`Preview ${preview._id}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(preview.images[0])}
                      />
                    </TableCell>
                    <TableCell sx={{ justifyContent: "flex-start" }}>
                      {preview.name}
                    </TableCell>
                    <TableCell>
                      {new Date(preview.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeleteDialogOpen(preview._id)}
                        sx={{ zIndex: -1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CommonDeleteDialog
        dialogOpen={deleteDialogOpen || deleteAllDialogOpen}
        onDialogclose={() => {
          handleDeleteDialogClose();
          handleDeleteAllDialogClose();
        }}
        onDelete={() => {
          if (deleteAllDialogOpen) {
            handleDeleteAll();
          } else {
            handleDelete();
          }
        }}
        title={
          deleteAllDialogOpen
            ? "Delete All Confirmation"
            : "Delete Confirmation"
        }
        content={
          deleteAllDialogOpen
            ? "Are you sure you want to delete all uploaded images?"
            : "Are you sure you want to delete the uploaded image?"
        }
        deleteAll={deleteAllDialogOpen}
      />

      <SpecialsDrawer
        open={openDrawer}
        onClose={handleDrawerClose}
        isAdd={false}
      />
      <Box>
        <Box>
          {fullscreenImageOpen && (
            <div
              className="fullscreen-overlay"
              onClick={handleCloseFullscreenImage}
            >
              <img
                src={selectedImage}
                alt="Full screen"
                className="fullscreen-image"
              />
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SpecialsPage;
