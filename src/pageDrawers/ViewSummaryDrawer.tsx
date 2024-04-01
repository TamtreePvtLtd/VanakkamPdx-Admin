import {
  Drawer,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import CommonDeleteDialog from "../common/components/CommonDeleteDialog";

interface ViewSummaryDrawerProps {
  summaryData: any[];
  open: boolean;
  onClose: () => void;
  selectedDate: string | null;
}

function ViewSummaryDrawer({
  summaryData,
  open,
  onClose,
  selectedDate,
}: ViewSummaryDrawerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
        p={2}
      >
        <Typography variant="h4" gutterBottom component="div">
          View Summary
        </Typography>
        <Box sx={{ cursor: "pointer" }} onClick={onClose}>
          <CloseIcon />
        </Box>
      </Box>
      <Divider />
      <Container>
        <TableContainer
          elevation={0}
          sx={{
            boxShadow: 3,
            mt: 2,
          }}
          component={Paper}
        >
          {summaryData.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Menu</TableCell>
                  <TableCell>Product title</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((item) => (
                  <TableRow key={item.menuId}>
                    <TableCell>
                      {item.selectedDate.format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{item.menu}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>
                      <IconButton>
                        <DeleteIcon onClick={() => handleDelete()} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body1">No data available</Typography>
          )}
        </TableContainer>
      </Container>
      <CommonDeleteDialog
        title="Remove Product"
        content="Are you sure you want to Remove the Product?"
        dialogOpen={deleteDialogOpen}
        onDialogclose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </Drawer>
  );
}

export default ViewSummaryDrawer;
