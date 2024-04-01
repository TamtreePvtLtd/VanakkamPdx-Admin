import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  Tooltip,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CateringEnquirieDrawer from "../../pageDrawers/CateringEnquiriesDrawer";
import {
  useChangeisResponseStatus,
  useDeleteEnquiry,
  useGetAllEnquiry,
} from "../../customRQHooks/Hooks";
import { ICateringEnquiries } from "../../interface/types";
import { format } from "date-fns";
import PaginatedHeader from "../../common/components/PaginatedHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { SnackbarSeverityEnum } from "../../enums/SnackbarSeverityEnums";
import { useSnackBar } from "../../context/SnackBarContext";
import { useTheme } from "@mui/material/styles";

function CateringEnquiries() {
  const { updateSnackBarState } = useSnackBar();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEnquiryData, setSelectedEnquiryData] =
    useState<ICateringEnquiries | null>(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: enquiryData, refetch } = useGetAllEnquiry(page, rowsPerPage);
  const deleteEnquiryMutation = useDeleteEnquiry();
  const isResponseUpdateMutation = useChangeisResponseStatus();
  useEffect(() => {
    refetch();
  }, [page, rowsPerPage]);
  const theme = useTheme();

  const openEnquiryViewDrawer = (enquiryData: ICateringEnquiries) => {
    setSelectedEnquiryData(enquiryData);
    setIsDrawerOpen(true);
  };

  const closeEnquiryViewDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEnquiryData(null);
  };

  const handleDelete = (enquiry: ICateringEnquiries) => {
    setDeleteDialogOpen(true);
    setSelectedEnquiryData(enquiry);
  };

  const onDelete = async () => {
    if (selectedEnquiryData && selectedEnquiryData._id) {
      await deleteEnquiryMutation.mutate(selectedEnquiryData._id, {
        onSuccess: () => {
          updateSnackBarState(
            true,
            "Enquiry deleted successfully",
            SnackbarSeverityEnum.SUCCESS
          );
          setDeleteDialogOpen(false);
        },
        onError: () => {
          console.error("Error deleting Enquiry");
          updateSnackBarState(
            true,
            "Error while deleting the Enquiry",
            SnackbarSeverityEnum.ERROR
          );
        },
      });
    } else {
      console.error("Invalid selectedenquiry or _id");
    }
  };
  const handleCheckboxChange = async (
    enquiryId: string,
    isChecked: boolean
  ) => {
    try {
      const response = isResponseUpdateMutation.mutate(enquiryId, {
        onSuccess: () => {
          updateSnackBarState(
            true,
            "Status updated successfully",
            SnackbarSeverityEnum.SUCCESS
          );
        },
      });
    } catch (error) {
      updateSnackBarState(
        true,
        "Error while update status",
        SnackbarSeverityEnum.ERROR
      );
      console.error(error);
    }
  };

  return (
    <>
      <Box padding={"20px"}>
        <PaginatedHeader
          pagetitle="Enquires"
          pageInfo={enquiryData?.pageInfo}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
        />
        <TableContainer
          elevation={0}
          sx={{
            boxShadow: 3,
          }}
          component={Paper}
        >
          <Table stickyHeader aria-label="catering-enquires">
            <TableHead >
              <TableRow >
                <TableCell sx={{
                  width: "10%", backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Full Name
                  </Typography>
                </TableCell>
                <TableCell sx={{
                  width: "20%", backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                </TableCell>
                <TableCell sx={{
                  width: "15%", backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Mobile Number
                  </Typography>
                </TableCell>
                <TableCell sx={{
                  width: "15%", backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Enquiry Date
                  </Typography>
                </TableCell>
                <TableCell sx={{
                  width: "20%", backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Message
                  </Typography>
                </TableCell>
                <TableCell sx={{
                  width: "15%", backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiryData &&
                enquiryData.items.length > 0 &&
                enquiryData.items.map((enquiryData, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 600 }}>{enquiryData.fullName}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{enquiryData.email}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{enquiryData.mobileNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {enquiryData.eventDate
                        ? format(new Date(enquiryData.eventDate), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "50px",
                        fontWeight: 600,
                      }}
                    >
                      {enquiryData.message}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "start",
                        }}
                      >
                        <Tooltip title="View Details" arrow>
                          <IconButton
                            onClick={() => openEnquiryViewDrawer(enquiryData)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton onClick={() => handleDelete(enquiryData)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            enquiryData.isResponse ? "Response" : " Response"
                          }
                          arrow
                        >
                          <Checkbox
                            inputProps={{ "aria-label": "controlled" }}
                            defaultChecked={enquiryData.isResponse}
                            onChange={(event) => {
                              if (event.target) {
                                handleCheckboxChange(
                                  enquiryData._id,
                                  event.target.checked
                                );
                              }
                            }}
                          />
                        </Tooltip>
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
          title="Delete Enquiry"
          content="Are you sure you want to delete the Enquiry?"
          dialogOpen={deleteDialogOpen}
          onDialogclose={() => setDeleteDialogOpen(false)}
          onDelete={onDelete}
        />
      )}
      {isDrawerOpen && (
        <CateringEnquirieDrawer
          isOpen={isDrawerOpen}
          onClose={closeEnquiryViewDrawer}
          selectedEnquiryData={selectedEnquiryData}
        />
      )}
    </>
  );
}

export default CateringEnquiries;
