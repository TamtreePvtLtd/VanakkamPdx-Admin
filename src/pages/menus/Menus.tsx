import { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IMenu } from "../../interface/menus";
import MenuDrawer from "../../pageDrawers/MenuDrawer";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { useDeleteMenu, useGetAllMenus } from "../../customRQHooks/Hooks";
import PaginatedHeader from "../../common/components/PaginatedHeader";
import { useSnackBar } from "../../context/SnackBarContext";
import { useTheme } from "@mui/material/styles";

function Menus() {
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: menus, refetch } = useGetAllMenus(page, rowsPerPage);
  const deleteMenuMutation = useDeleteMenu();
  const { updateSnackBarState } = useSnackBar();
  const theme = useTheme();

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage]);

  const handleMenuDrawerclose = () => {
    setMenuDrawerOpen(false);
  };

  const handleEditMenu = (menu: IMenu) => {
    setSelectedMenu({ ...menu });
    setMenuDrawerOpen(true);
  };
  const handleAddMenuClick = () => {
    setSelectedMenu(null);
    setMenuDrawerOpen(true);
  };

  const handleDelete = (menu: IMenu) => {
    setSelectedMenu(menu);
    setDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    try {
      if (selectedMenu && selectedMenu._id) {
        await deleteMenuMutation.mutateAsync(selectedMenu._id, {
          onSuccess: () => {
            updateSnackBarState(true, "Menu removed successfully.", "success");
          },
          onError: () => {
            updateSnackBarState(true, "Error while remove category.", "error");
          },
        });
        setDeleteDialogOpen(false);
      } else {
        console.error("Invalid selectedMenu or _id");
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  return (
    <>
      <Box paddingX={"20px"} justifyContent="space-between" alignItems="center">
        <PaginatedHeader
          pagetitle="Menus"
          pageInfo={menus?.pageInfo}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
          onAddClick={handleAddMenuClick}
          addButtonText={" + Add Menu"}
        />


        <Grid item xs={12}>
          <TableContainer
            elevation={0}
            sx={{
              // boxShadow: 3,
              // width: "100%",
            }}
            component={Paper}
          >
            <Table stickyHeader aria-label="menus-table" >
              <TableHead className='table-header'>
                <TableRow className='table-header-row'>

                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      // textAlign: "center",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      MenuType
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      // textAlign: "left",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      SubMenus
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      // textAlign: "center",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menus?.items &&
                  menus?.items.length > 0 &&
                  menus?.items.map((menu) => (
                    <TableRow key={menu._id}>
                      <TableCell sx={{ fontWeight: 600 }}>{menu.title}</TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {menu.menuType}
                      </TableCell>
                      <TableCell >
                        {menu.subMenus &&
                          menu.subMenus.length > 0 &&
                          menu.subMenus?.map((subMenu, index) => (
                            <Box key={index} sx={{ fontWeight: 600 }}>{subMenu.title}</Box>
                          ))}
                      </TableCell>

                      <TableCell >
                        <IconButton>
                          <EditIcon onClick={() => handleEditMenu(menu)} />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon onClick={() => handleDelete(menu)} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

      </Box>
      {menuDrawerOpen && (
        <MenuDrawer
          selectedMenu={selectedMenu}
          menuDrawerOpen={menuDrawerOpen}
          handleMenuDrawerclose={handleMenuDrawerclose}
        />
      )}
      {deleteDialogOpen && (
        <CommonDeleteDialog
          title="Delete Menu"
          content="Are you sure you want to delete the Menu?"
          dialogOpen={deleteDialogOpen}
          onDialogclose={() => setDeleteDialogOpen(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
export default Menus;
