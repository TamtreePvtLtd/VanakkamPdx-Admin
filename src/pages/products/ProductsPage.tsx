import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProductPageDrawer from "../../pageDrawers/ProductDrawer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { getAllMenusForAddProduct } from "../../services/api";
import {
  useDeleteProduct,
  useGetAllProduct,
  useGetProducts,
} from "../../customRQHooks/Hooks";
import { useSnackBar } from "../../context/SnackBarContext";
import { IProduct, IProductPageMenuDropDown } from "../../interface/types";
import PaginatedHeader from "../../common/components/PaginatedHeader";

function ProductsPage() {
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [menuData, setMenuData] = useState<IProductPageMenuDropDown[]>([]);
  const [selectedMenuValue, setSelectedMenuValue] =
    useState<IProductPageMenuDropDown | null>(null);
  const [selectedSubmenuValues, setSelectedSubmenuValues] = useState<string[]>(
    []
  );
  const [displayedData, setDisplayedData] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const deleteProductMutation = useDeleteProduct();
  const { updateSnackBarState } = useSnackBar();

  const { data, refetch: refetchProduct } = useGetProducts(
    selectedMenuValue?._id || "",
    selectedSubmenuValues
  );
  const { data: allProduct, refetch } = useGetAllProduct(page, rowsPerPage);

  useEffect(() => {
    if (selectedMenuValue === null) {
      setDisplayedData(allProduct?.items || []);
    } else {
      setDisplayedData(data || []);
    }
  }, [selectedMenuValue, allProduct, data]);

  const openDrawer = () => {
    setIsProductDrawerOpen(true);
  };
  const handleDialogclose = () => {
    setIsProductDrawerOpen(false);
    setSelectedProduct(null);
  };
  const handleAddProduct = () => {
    openDrawer();
    setIsAdd(true);
  };
  const handleEditProduct = (product: IProduct) => {
    refetchProduct();
    setSelectedProduct({ ...product });
    openDrawer();
    setIsAdd(false);
  };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDeleteDialogOpen = (product: IProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleMenuChange = (event, value) => {
    setSelectedMenuValue(value);
  };

  const getAllMenusData = async () => {
    try {
      const response = await getAllMenusForAddProduct();
      const mappedResponse = response.map((menu) => menu);
      setMenuData(mappedResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMenusData();
    refetch();
  }, [page, rowsPerPage]);

  const clearSearch = () => {
    setSelectedMenuValue(null);
    setSelectedSubmenuValues([]);
  };

  const handleSubmenuChange = (value) => {
    if (selectedSubmenuValues.includes(value)) {
      setSelectedSubmenuValues(
        selectedSubmenuValues.filter((item) => item !== value)
      );
    } else {
      setSelectedSubmenuValues([...selectedSubmenuValues, value]);
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct, {
        onSuccess: () => {
          updateSnackBarState(true, "Product removed successfully.", "success");
          setDeleteDialogOpen(false);
        },
        onError: () => {
          updateSnackBarState(true, "Error while remove Product.", "error");
        },
      });
    }
  };

  const handleGetAllProducts = () => {
    clearSearch();
    setPage(1);
    setSelectedMenuValue(null);
    setSelectedSubmenuValues([]);
    refetch();
  };

  return (
    <Box sx={{ py: 2, marginLeft: "40px", marginRight: "40px" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Autocomplete
            id="combo-box-demo"
            options={menuData || []}
            getOptionLabel={(option) => option.title}
            value={selectedMenuValue}
            onChange={handleMenuChange}
            sx={{ width: 300, marginRight: 2 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Menu" size="small" />
            )}
          />

          <Box ml={2}>
            {selectedMenuValue &&
              selectedMenuValue.subMenus.length > 0 &&
              selectedMenuValue.subMenus.map((data, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSubmenuValues.includes(data._id)}
                      onChange={() => handleSubmenuChange(data._id)}
                    />
                  }
                  label={data.title}
                  key={index}
                />
              ))}
          </Box>

          <Box ml={2}>
            {selectedMenuValue === null && (
              <PaginatedHeader
                pagetitle="product"
                pageInfo={allProduct?.pageInfo}
                onRowsPerPageChange={setRowsPerPage}
                onPageChange={setPage}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ float: "left" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={clearSearch}
            sx={{ color: "#038265", marginRight: 1 }}
          >
            Clear Search
          </Button>
          {/* <Button
            variant="outlined"
            size="small"
            onClick={handleGetAllProducts}
            sx={{ color: "#038265" }}
          >
            All
          </Button> */}
        </Box>

        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          + Add Product
        </Button>
      </Box>

      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Image
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "15%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Title
                  </Typography>
                </TableCell>
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
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "17%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Catering Size-Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "17%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    DailyMenu Size-Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    align="center"
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData &&
                displayedData.length > 0 &&
                displayedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ textAlign: "left" }}>
                      <img
                        src={
                          typeof item.posterURL === "string"
                            ? item.posterURL
                            : undefined
                        }
                        alt={item.title}
                        height="50px"
                        width="50px"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ textAlign: "left", fontWeight: 600 }}
                    >
                      {item.title}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        textAlign: "left",
                        maxWidth: "50px",
                        fontWeight: 600,
                      }}
                    >
                      {item.description}
                    </TableCell>
                    <TableCell style={{ textAlign: "left", fontWeight: 600 }}>
                      {item.itemSizeWithPrice &&
                        item.itemSizeWithPrice.length > 0 &&
                        item.itemSizeWithPrice.map((qty, index) => (
                          <Box key={index} m={1}>
                            <>
                              {qty.size} - ${qty.price}
                            </>
                          </Box>
                        ))}
                    </TableCell>

                    <TableCell style={{ textAlign: "left", fontWeight: 600 }}>
                      {item.cateringMenuSizeWithPrice.length > 0 &&
                        item.cateringMenuSizeWithPrice.map((qty, index) => (
                          <>
                            <Box key={index} m={1}>
                              <>
                                {qty.size} - ${qty.price}
                              </>
                            </Box>
                            {index <
                              item.cateringMenuSizeWithPrice.length - 1 && (
                              <Divider />
                            )}
                          </>
                        ))}
                    </TableCell>
                    <TableCell style={{ textAlign: "left", fontWeight: 600 }}>
                      {item.dailyMenuSizeWithPrice.length > 0 &&
                        item.dailyMenuSizeWithPrice.map((qty, index) => (
                          <>
                            <Box key={index} m={1}>
                              <>
                                {qty.size} - ${qty.price}
                              </>
                            </Box>
                            {index < item.dailyMenuSizeWithPrice.length - 1 && (
                              <Divider />
                            )}
                          </>
                        ))}
                    </TableCell>

                    <TableCell align="left" sx={{ textAlign: "left" }}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton>
                          <EditIcon onClick={() => handleEditProduct(item)} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteDialogOpen(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {deleteDialogOpen && (
        <CommonDeleteDialog
          title="Delete Product"
          content="Are You Sure Want To Delete The Product?"
          dialogOpen={deleteDialogOpen}
          onDialogclose={() => setDeleteDialogOpen(false)}
          onDelete={handleDelete}
        />
      )}
      {isProductDrawerOpen && (
        <ProductPageDrawer
          selectedProduct={selectedProduct}
          dialogOpen={isProductDrawerOpen}
          onCloseDialog={handleDialogclose}
          isAdd={isAdd}
        />
      )}
    </Box>
  );
}

export default ProductsPage;
