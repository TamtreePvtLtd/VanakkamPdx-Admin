import * as React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getAllMenusForAddProduct } from "../services/api";
import { ProductInitialValue } from "../constants/initialValue";
import imageCompression from "browser-image-compression";
import ProductImage from "../common/ProductImage";
import { useCreateProduct, useUpdateProduct } from "../customRQHooks/Hooks";
import { useSnackBar } from "../context/SnackBarContext";
import { IMenu, IProduct } from "../interface/types";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface IProductPageDrawerProps {
  dialogOpen: boolean;
  onCloseDialog: () => void;
  isAdd: boolean;
  selectedProduct: IProduct | null;
}

function ProductPageDrawer(props: IProductPageDrawerProps) {
  const {
    dialogOpen: isProductDrawerOpen,
    onCloseDialog,
    isAdd,
    selectedProduct,
  } = props;

  const [selectedImages, setSelectedImages] = useState<Array<string | File>>(
    []
  );
  const [menuData, setMenuData] = useState<IMenu[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [product, setProduct] = useState<IProduct>(ProductInitialValue);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [selectedPosterImage, setSelectedPosterImage] = useState<
    string | undefined
  >("");
  const [showPriceField, setShowPriceField] = useState(false);
  const [showCateringSizeField, setShowCateringSizeField] = useState(false);
  const [showDailyMenuSizeField, setShowDailyMenuSizeField] = useState(false);
  const [error, setError] = useState("");

  var updateProductMutation = useUpdateProduct();
  var productCreateMutation = useCreateProduct();

  const { updateSnackBarState } = useSnackBar();

  const handleClose = () => {
    onCloseDialog();
    setImagesToRemove([]);
  };

  // Get All Menus
  const getAllMenusData = async () => {
    try {
      const response = await getAllMenusForAddProduct();

      const mappedResponse = response.map((menu) => menu);

      setMenuData(mappedResponse);
    } catch (error) {
      updateSnackBarState(true, "Error while fetch Menus.", "error");
    }
  };
  useEffect(() => {
    getAllMenusData();
  }, []);

  // HandleCompressfile
  async function handleCompressFile(event: File): Promise<File | undefined> {
    const imageFile = event;

    let options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    // Check if the image size is above 1 MB
    if (imageFile.size > 1024 * 1024) {
      // Reduce the maxSizeMB to compress the image to approximately 500 KB
      options.maxSizeMB = 0.5;
    }

    try {
      const compressedBlob = await imageCompression(imageFile, options);
      const compressedFile = new File([compressedBlob], imageFile.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      return compressedFile;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  // HandlePosterImageUpload
  const handlePosterImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];

    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedPosterImage(url);

    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      const compressedFile = await handleCompressFile(file);

      if (compressedFile) {
        if (product.posterURL) {
          setImagesToRemove((prevImagesToRemove) => [
            ...prevImagesToRemove,
            product.posterURL as string,
          ]);
        }
        setProduct((prevProduct) => ({
          ...prevProduct,
          posterURL: compressedFile,
        }));
      } else {
        console.log("Error compressing the file.");
      }
    } else {
      updateSnackBarState(
        true,
        "Invalid file format. Please select JPEG or PNG or JPG file.",
        "error"
      );
    }
  };

  // HandleImageUpload
  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...urls]);

    if (files) {
      const filesArray: File[] = Array.from(files);
      const validFiles = filesArray.filter(
        (file) =>
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg"
      );

      const compressedFiles = await Promise.all(
        validFiles.map((file) => handleCompressFile(file))
      );

      const compressedValidFiles = compressedFiles.filter(
        (compressedFile) => compressedFile !== undefined
      ) as File[];

      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...compressedValidFiles],
      }));
    } else {
      console.log(
        "Invalid file format. Please select a JPEG or PNG or JPG file."
      );
    }
  };

  const handleAddItemSize = () => {
    const updatedProduct = {
      ...product,
      itemSizeWithPrice: [
        ...product.itemSizeWithPrice,
        { size: "", price: "" },
      ],
    };

    setProduct(updatedProduct);
  };

  const handleAddCateringSize = () => {
    const updatedProduct = {
      ...product,
      cateringMenuSizeWithPrice: [
        ...product.cateringMenuSizeWithPrice,
        { size: "", price: "", quantity: 0 },
      ],
    };

    setProduct(updatedProduct);
  };

  const handleAddDailyMenuSize = () => {
    const updateProduct = {
      ...product,
      dailyMenuSizeWithPrice: [
        ...product.dailyMenuSizeWithPrice,
        { size: "", price: "" },
      ],
    };

    setProduct(updateProduct);
  };
  const handleDeleteDailyMenuSize = (index: number) => {
    const updatedProduct = (prevProduct) => {
      const servingSizesCopy = [...prevProduct.dailyMenuSizeWithPrice];
      servingSizesCopy.splice(index, 1);
      return { ...prevProduct, dailyMenuSizeWithPrice: servingSizesCopy };
    };

    setProduct(updatedProduct);
  };

  const handleDeleteCateringSize = (index: number) => {
    const updatedProduct = (prevProduct) => {
      const servingSizesCopy = [...prevProduct.cateringMenuSizeWithPrice];
      servingSizesCopy.splice(index, 1);
      return { ...prevProduct, cateringMenuSizeWithPrice: servingSizesCopy };
    };

    setProduct(updatedProduct);
  };

  const handleDailyMenuSizeChange = (
    index: number,
    field: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    setProduct((prevProduct) => {
      const servingSizesCopy = [...prevProduct.dailyMenuSizeWithPrice];
      servingSizesCopy[index] = {
        ...servingSizesCopy[index],
        [field]: newValue,
      };
      return { ...prevProduct, dailyMenuSizeWithPrice: servingSizesCopy };
    });
  };

  const handleCateringSizeChange = (
    index: number,
    field: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    setProduct((prevProduct) => {
      const servingSizesCopy = [...prevProduct.cateringMenuSizeWithPrice];
      servingSizesCopy[index] = {
        ...servingSizesCopy[index],
        [field]: newValue,
      };
      return {
        ...prevProduct,
        cateringMenuSizeWithPrice: servingSizesCopy,
      };
    });
  };

  // const handleSaveProduct = async (e: any) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   if (!product.title) {
  //     updateSnackBarState(true, "Title is required.", "error");
  //     return;
  //   }
  //   if (product.menu.mainMenuIds.length === 0) {
  //     updateSnackBarState(true, "Menu is required", "error");
  //     return;
  //   }

  //   if (!product.posterURL) {
  //     updateSnackBarState(true, "Poster image is required.", "error");
  //     return;
  //   }
  //   formData.append("title", product.title);
  //   formData.append("description", product.description);
  //   formData.append("netWeight", product.netWeight.toString());
  //   // formData.append("price", String(product.price));
  //   formData.append("menu", JSON.stringify(product.menu));

  //   product.images.forEach((image, index) => {
  //     formData.append(`image_${index}`, image);
  //   });

  //   formData.append(
  //     "cateringMenuSizeWithPrice",
  //     JSON.stringify(product.cateringMenuSizeWithPrice)
  //   );

  //   formData.append(
  //     "itemSizeWithPrice",
  //     JSON.stringify(product.itemSizeWithPrice)
  //   );
  //   formData.append(
  //     "dailyMenuSizeWithPrice",
  //     JSON.stringify(product.dailyMenuSizeWithPrice)
  //   );

  //   formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
  //   if (product.posterURL) {
  //     formData.append("posterImage", product.posterURL);
  //   }
  //   formData.append("producId", product._id ?? "");
  //   formData.append("servingSizeDescription", product.servingSizeDescription);
  //   formData.append("ingredients", product.ingredients);

  //   try {
  //     if (isAdd) {
  //       productCreateMutation.mutate(formData, {
  //         onSuccess: () => {
  //           updateSnackBarState(true, "Product added successfully.", "success");
  //           onCloseDialog();
  //         },
  //         onError: () => {
  //           updateSnackBarState(true, "Error while add Product.", "error");
  //         },
  //       });
  //     } else {
  //       updateProductMutation.mutate(formData, {
  //         onSuccess: () => {
  //           updateSnackBarState(
  //             true,
  //             "Product updated successfully.",
  //             "success"
  //           );
  //           onCloseDialog();
  //         },
  //         onError: () => {
  //           updateSnackBarState(true, "Error while update Product.", "error");
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSaveProduct = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    let validationError = false;

    if (!product.title) {
      updateSnackBarState(true, "Title is required.", "error");
      validationError = true;
    }

    if (product.menu.mainMenuIds.length === 0) {
      updateSnackBarState(true, "Menu is required", "error");
      validationError = true;
    }

    if (!product.posterURL) {
      updateSnackBarState(true, "Poster image is required.", "error");
      validationError = true;
    }

    // Validate item sizes and prices
    if (showPriceField) {
      product.itemSizeWithPrice.forEach((value, index) => {
        const price = String(value.price); // Ensure value.price is always a string
        if (value.size.trim() === "" || value.size.trim().length > 9) {
          updateSnackBarState(
            true,
            `Size cannot be empty or exceed 9 characters for Item ${
              index + 1
            }.`,
            "error"
          );
          validationError = true;
        }
        if (price.trim() === "" || price.trim().length > 7) {
          updateSnackBarState(
            true,
            `Price cannot be empty or exceed 7 characters for Item ${
              index + 1
            }.`,
            "error"
          );
          validationError = true;
        }
      });
    }

    if (showDailyMenuSizeField) {
      product.dailyMenuSizeWithPrice.forEach((value, index) => {
        const price = String(value.price); // Ensure value.price is always a string
        if (value.size.trim() === "" || value.size.trim().length > 9) {
          updateSnackBarState(
            true,
            `Size cannot be empty or exceed 9 characters for DailyMenu Size ${
              index + 1
            }.`,
            "error"
          );
          validationError = true;
        }
        if (price.trim() === "" || price.trim().length > 7) {
          updateSnackBarState(
            true,
            `Price cannot be empty or exceed 7 characters for DailyMenu Size ${
              index + 1
            }.`,
            "error"
          );
          validationError = true;
        }
      });
    }

    // Validate catering sizes and prices
    if (showCateringSizeField) {
      product.cateringMenuSizeWithPrice.forEach((value, index) => {
        const price = String(value.price); // Ensure value.price is always a string
        if (value.size.trim() === "" || value.size.trim().length > 11) {
          updateSnackBarState(
            true,
            `Size cannot be empty or exceed 11 characters for Catering Size ${
              index + 1
            }.`,
            "error"
          );
          validationError = true;
        }
        if (price.trim() === "" || price.trim().length > 7) {
          updateSnackBarState(
            true,
            `Price cannot be empty or exceed 7 characters for Catering Size ${
              index + 1
            }.`,
            "error"
          );
          validationError = true;
        }
      });
    }
    const snacksMenu = menuData.find((menu) => menu.title === "Snacks");

    if (
      snacksMenu &&
      product.menu.mainMenuIds.includes(snacksMenu._id) &&
      !snacksMenu.subMenus.some((submenu) =>
        product.menu.subMenuIds.includes(submenu._id)
      )
    ) {
      updateSnackBarState(
        true,
        `Please select a submenu for "${snacksMenu.title}".`,
        "error"
      );
      validationError = true;
    }

    if (validationError) {
      return;
    }

    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("netWeight", product.netWeight.toString());
    formData.append("menu", JSON.stringify(product.menu));

    product.images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    formData.append(
      "cateringMenuSizeWithPrice",
      JSON.stringify(product.cateringMenuSizeWithPrice)
    );

    formData.append(
      "itemSizeWithPrice",
      JSON.stringify(product.itemSizeWithPrice)
    );
    formData.append(
      "dailyMenuSizeWithPrice",
      JSON.stringify(product.dailyMenuSizeWithPrice)
    );

    formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
    if (product.posterURL) {
      formData.append("posterImage", product.posterURL);
    }
    formData.append("producId", product._id ?? "");
    formData.append("servingSizeDescription", product.servingSizeDescription);
    formData.append("ingredients", product.ingredients);

    try {
      if (isAdd) {
        productCreateMutation.mutate(formData, {
          onSuccess: () => {
            updateSnackBarState(true, "Product added successfully.", "success");
            onCloseDialog();
          },
          onError: () => {
            updateSnackBarState(true, "Error while add Product.", "error");
          },
        });
      } else {
        updateProductMutation.mutate(formData, {
          onSuccess: () => {
            updateSnackBarState(
              true,
              "Product updated successfully.",
              "success"
            );
            onCloseDialog();
          },
          onError: () => {
            updateSnackBarState(true, "Error while update Product.", "error");
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedProduct && selectedProduct._id) {
      setProduct({ ...selectedProduct });
      if (selectedProduct.images && Array.isArray(selectedProduct.images)) {
        setSelectedImages([...selectedProduct.images]);
      }
      if (selectedProduct.posterURL) {
        if (typeof selectedProduct.posterURL === "string") {
          setSelectedPosterImage(selectedProduct.posterURL);
        } else {
          setSelectedPosterImage("");
        }
      }

      setShowPriceField(!!selectedProduct.itemSizeWithPrice);
      setShowCateringSizeField(
        selectedProduct.cateringMenuSizeWithPrice.length > 0
      );
      setShowDailyMenuSizeField(
        selectedProduct.dailyMenuSizeWithPrice.length > 0
      );
    }
  }, [selectedProduct]);

  // handle delete image
  const handleDeleteImage = (index: number) => {
    const updatedImages = [
      ...selectedImages.slice(0, index),
      ...selectedImages.slice(index + 1),
    ];

    setSelectedImages(updatedImages);

    const removedImage = selectedImages[index];
    setImagesToRemove((prevImagesToRemove) => [
      ...prevImagesToRemove,
      String(removedImage),
    ]);

    // Remove from product.images
    const updatedProductImages = [...product.images];
    updatedProductImages.splice(index, 1);
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedProductImages,
    }));
  };

  const handleSizeChange = (index, newSize) => {
    const updatedSizes = [...product.itemSizeWithPrice];
    updatedSizes[index].size = newSize;
    setProduct((prevState) => ({
      ...prevState,
      itemSizeWithPrice: updatedSizes,
    }));
  };

  // Function to handle price change
  const handlePriceChange = (index, newPrice) => {
    const updatedPrices = [...product.itemSizeWithPrice];
    updatedPrices[index].price = newPrice;
    setProduct((prevState) => ({
      ...prevState,
      itemSizeWithPrice: updatedPrices,
    }));
  };

  // Function to handle deletion of item size
  const handleDeleteItemSize = (index) => {
    const updatedSizes = [...product.itemSizeWithPrice];
    updatedSizes.splice(index, 1);
    setProduct((prevState) => ({
      ...prevState,
      itemSizeWithPrice: updatedSizes,
    }));
  };

const handleTitleChange = (e) => {
  const { value } = e.target;
  if (value.length <= 18) {
    setProduct((prevState) => ({
      ...prevState,
      title: value,
    }));
    setError(""); 
  } else if (
    value.length > 18 &&
    e.nativeEvent.inputType === "deleteContentBackward"
  ) {
    setProduct((prevState) => ({
      ...prevState,
      title: value,
    }));
    setError("");
  } else {
    setError("Title must be 18 characters or fewer.");
  }
};

  return (
    <>
      <Dialog
        fullScreen
        open={isProductDrawerOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          m={1}
        >
          <Box>
            <Typography sx={{ fontWeight: "bolder", fontSize: "25px" }}>
              {isAdd ? "Add Product" : "Edit Product"}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
        </Box>
        <Divider />
        <form>
          <Box sx={{ padding: "20px 24px" }}>
            <Grid container spacing={5}>
              <Grid item md={5}>
                <Box sx={{ marginBottom: "5px" }}>
                  <Typography variant="subtitle1">
                    Title <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={product.title}
                    onChange={handleTitleChange}
                  />
                  {error && (
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ margin: "5px 0" }}>
                  <Typography variant="subtitle1">Description</Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={6}
                    value={product.description}
                    onChange={(e) =>
                      setProduct((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }))
                    }
                  />
                </Box>
                <Box sx={{ margin: "5px 0" }}>
                  <Typography variant="subtitle1">
                    Menus <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Box>
                <Box>
                  {menuData.length > 0 &&
                    menuData.map((data, index) => (
                      <Accordion
                        key={index}
                        expanded={product.menu.mainMenuIds.includes(data._id)}
                      >
                        <AccordionSummary
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* <KeyboardDoubleArrowRightIcon fontSize="small" /> */}
                            <FormGroup
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                              }}
                            >
                              <FormControlLabel
                                value={data._id}
                                control={
                                  <Checkbox
                                    size="small"
                                    sx={{
                                      "& .MuiCheckbox-root": {
                                        borderWidth: 0.5,
                                        borderStyle: "dotted",
                                      },
                                    }}
                                    checked={product.menu.mainMenuIds.includes(
                                      data._id
                                    )}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setProduct((prevState) => ({
                                        ...prevState,
                                        menu: {
                                          ...prevState.menu,
                                          mainMenuIds: isChecked
                                            ? [
                                                ...prevState.menu.mainMenuIds,
                                                data._id,
                                              ]
                                            : prevState.menu.mainMenuIds.filter(
                                                (id) => id !== data._id
                                              ),
                                        },
                                      }));
                                    }}
                                  />
                                }
                                label={data.title}
                              />
                            </FormGroup>
                          </Box>
                        </AccordionSummary>
                        {data.subMenus.length > 0 && (
                          <AccordionDetails sx={{ marginLeft: "40px" }}>
                            <Typography variant="subtitle1">
                              SubMenus
                            </Typography>
                            {data.subMenus.map((submenu, index) => (
                              <FormGroup
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                }}
                                key={index}
                              >
                                <FormControlLabel
                                  value={submenu.title}
                                  control={
                                    <Checkbox
                                      size="small"
                                      sx={{
                                        "& .MuiCheckbox-root": {
                                          position: "relative",
                                          "&:after": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            border: "1px dotted #000",

                                            borderRadius: 4,

                                            pointerEvents: "none",
                                          },
                                        },
                                      }}
                                      checked={product.menu.subMenuIds.includes(
                                        submenu._id
                                      )}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setProduct((prevState) => ({
                                          ...prevState,
                                          menu: {
                                            ...prevState.menu,
                                            subMenuIds: isChecked
                                              ? [
                                                  ...prevState.menu.subMenuIds,
                                                  submenu._id,
                                                ]
                                              : prevState.menu.subMenuIds.filter(
                                                  (id) => id !== submenu._id
                                                ),
                                          },
                                        }));
                                      }}
                                    />
                                  }
                                  label={submenu.title}
                                />
                              </FormGroup>
                            ))}
                          </AccordionDetails>
                        )}
                      </Accordion>
                    ))}
                </Box>
              </Grid>
              <Grid item md={7}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  mt={3}
                >
                  <Typography
                    sx={{
                      marginRight: "5px",
                    }}
                    variant="subtitle1"
                  >
                    Poster Image <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      style={{ color: "#038265" }}
                    >
                      Upload Images
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={handlePosterImageUpload}
                      />
                    </Button>
                  </Box>
                </Box>
                {selectedPosterImage && (
                  <Box mt={2}>
                    <img
                      src={selectedPosterImage}
                      alt="posterImage"
                      height="90px"
                      width="90px"
                    />
                  </Box>
                )}
                <Box
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  mt={3}
                >
                  <Typography
                    sx={{
                      marginRight: "5px",
                    }}
                    variant="subtitle1"
                  >
                    Images
                  </Typography>
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      style={{ color: "#038265" }}
                    >
                      Upload Images
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleImagesUpload}
                        multiple
                      />
                    </Button>
                  </Box>
                </Box>
                <Box mt={2} sx={{ display: "flex", gap: 1 }}>
                  {selectedImages &&
                    selectedImages.map((image, index) => (
                      <ProductImage
                        file={image}
                        index={index}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                        handleDeleteImage={(deleteIndex) =>
                          handleDeleteImage(deleteIndex)
                        }
                        id={`newProductUplodedImagesContainer${index + 1}`}
                      />
                    ))}
                </Box>
                <Box mt={3}>
                  <Typography variant="subtitle1">
                    Product Price <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showPriceField}
                          onChange={(e) => setShowPriceField(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Price($)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showCateringSizeField}
                          onChange={(e) =>
                            setShowCateringSizeField(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Catering Size"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showDailyMenuSizeField}
                          onChange={(e) =>
                            setShowDailyMenuSizeField(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="DailyMenu Size"
                    />
                  </FormGroup>
                </Box>
                {/* {showPriceField && (
                  <>
                    <Grid container spacing={3} mb={1}>
                      <Grid item md={5}>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            Size
                          </Typography>
                          <TextField
                            sx={{ width: "70%" }}
                            size="small"
                            // value={product.size}
                            onChange={(event) =>
                              setProduct((prevState) => ({
                                ...prevState,
                                size: event.target.value,
                              }))
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item md={5}>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            Price($)
                          </Typography>
                          <TextField
                         
                            
                            sx={{ width: "70%" }}
                            size="small"
                            value={product.price}
                            onChange={(event) => {
                              if (/^\d*\.?\d*$/.test(event.target.value)) {
                                setProduct((prevState) => ({
                                  ...prevState,
                                  price: event.target.value,
                                }));
                              }
                            }}
                            inputProps={{
                              pattern: "^\\d*\\.?\\d*$",
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{ display: "flex", alignItems: "center",mt:"20px" }}
                      >
                        <Box>
                          <Button variant="contained" size="small">
                            <AddIcon /> Add
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )} */}
                {showPriceField && (
                  <>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                      mt={2}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px" }}
                      >
                        Item Price
                      </Typography>
                      <Button variant="contained" onClick={handleAddItemSize}>
                        <AddIcon /> Add
                      </Button>
                    </Box>
                    {product.itemSizeWithPrice.length > 0 &&
                      product.itemSizeWithPrice.map((value, index) => (
                        <Grid container spacing={3} mb={1} key={index}>
                          <Grid item md={5}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                }}
                              >
                                Size <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                sx={{ width: "70%" }}
                                size="small"
                                value={value.size} // Accessing size at the current index
                                onChange={(event) =>
                                  handleSizeChange(index, event.target.value)
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item md={5}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                }}
                              >
                                Price$ <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                sx={{ width: "70%" }}
                                size="small"
                                value={value.price} // Accessing price at the current index
                                onChange={(event) =>
                                  handlePriceChange(index, event.target.value)
                                }
                                inputProps={{
                                  pattern: "^\\d*\\.?\\d*$",
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={2}
                            sx={{ display: "flex", alignItems: "flex-end" }}
                          >
                            <IconButton
                              onClick={() => handleDeleteItemSize(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                  </>
                )}

                {showCateringSizeField && (
                  <>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                      mt={2}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px" }}
                      >
                        Catering Size
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleAddCateringSize}
                      >
                        <AddIcon /> Add
                      </Button>
                    </Box>
                    {product.cateringMenuSizeWithPrice.length > 0 &&
                      product.cateringMenuSizeWithPrice.map((value, index) => (
                        <Grid container spacing={3} mb={1} key={index}>
                          <Grid item md={5}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                }}
                              >
                                Size <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                value={value.size}
                                onChange={(event) =>
                                  handleCateringSizeChange(index, "size", event)
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item md={5}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                }}
                              >
                                Price($) <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                value={value.price}
                                onChange={(event) =>
                                  handleCateringSizeChange(
                                    index,
                                    "price",
                                    event
                                  )
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={2}
                            sx={{ display: "flex", alignItems: "flex-end" }}
                          >
                            <IconButton
                              onClick={() => handleDeleteCateringSize(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                  </>
                )}
                {showDailyMenuSizeField && (
                  <>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                      mt={2}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px" }}
                      >
                        DailyMenu Size
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleAddDailyMenuSize}
                      >
                        <AddIcon /> Add
                      </Button>
                    </Box>
                    {product.dailyMenuSizeWithPrice.length > 0 &&
                      product.dailyMenuSizeWithPrice.map((value, index) => (
                        <Grid container spacing={3} mb={1} key={index}>
                          <Grid item md={5}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                }}
                              >
                                Size <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                value={value.size}
                                onChange={(event) =>
                                  handleDailyMenuSizeChange(
                                    index,
                                    "size",
                                    event
                                  )
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item md={5}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                }}
                              >
                                Price($) <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                value={value.price}
                                onChange={(event) =>
                                  handleDailyMenuSizeChange(
                                    index,
                                    "price",
                                    event
                                  )
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={2}
                            sx={{ display: "flex", alignItems: "flex-end" }}
                          >
                            <IconButton
                              onClick={() => handleDeleteDailyMenuSize(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                  </>
                )}

                <Box mt={2}>
                  {/* <Typography variant="subtitle1" sx={{ marginRight: "5px" }}>
                    Ingredients
                  </Typography>
                  <TextField
                    variant="outlined"
                    multiline
                    minRows={4}
                    maxRows={6}
                    fullWidth
                    value={product.ingredients}
                    onChange={(e) =>
                      setProduct((prevState) => ({
                        ...prevState,
                        ingredients: e.target.value,
                      }))
                    }
                  /> */}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {menuData && (
            <Box mr={3} mb={1} sx={{ position: "fixed", bottom: 0, right: 0 }}>
              <Button
                variant="outlined"
                sx={{ marginRight: "5px", color: "#038265" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  "&:hover": {
                    backgroundColor: "#038265",
                  },
                }}
                onClick={handleSaveProduct}
              >
                Save
              </Button>
            </Box>
          )}
        </form>
      </Dialog>
    </>
  );
}

export default ProductPageDrawer;
