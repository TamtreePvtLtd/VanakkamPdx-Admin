import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import theme from "../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateSpecials } from "../customRQHooks/Hooks";

function ImagePreview({ preview }) {
  return (
    <img
      src={preview}
      alt="Image Preview"
      style={{ width: "100px", height: "100px", marginRight: "10px" }}
    />
  );
}

function SpecialsDrawer({ open, onClose }) {
  const [specialData, setSpecialData] = useState({
    name: "", 
    description: "",
    images: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const createProductSpecial = useCreateSpecials();

  const handleInputChange = (field, value) => {
    setSpecialData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files: FileList | null = event.target.files;

      if (files) {
        const imageFiles: File[] = Array.from(files);
        const previews: string[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const preview = URL.createObjectURL(file);
          previews.push(preview);
        }

        setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
        setImages((prevImages) => [...prevImages, ...imageFiles]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    // Append name to formData
    formData.append("name", specialData.name);

    // Append images to formData
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    try {
      const response = await createProductSpecial.mutate(formData);
      setImagePreview([]);
      setImages([]);
      onClose();
      setSpecialData((prevData) => ({ ...prevData, name: "" }));
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Add Special</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <TextField
          label="Name"
          variant="outlined"
          value={specialData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          component="label"
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ color: theme.palette.primary.main }}
        >
          Upload Images
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
            multiple
          />
        </Button>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          {imagePreview.map((preview, index) => (
            <ImagePreview key={index} preview={preview} />
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
        >
          Save Special
        </Button>
      </Box>
    </Drawer>
  );
}

export default SpecialsDrawer;
