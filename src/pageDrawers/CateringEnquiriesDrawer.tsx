import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";
import { Container, Divider, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import { ICateringEnquiries } from "../interface/types";
import { format } from "date-fns";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEnquiryData: ICateringEnquiries | null;
}

function CateringEnquirieDrawer(props: IProps) {
  const { isOpen, onClose, selectedEnquiryData } = props;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "50%",
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
          Enquiry Details
        </Typography>
        <Box sx={{ cursor: "pointer" }} onClick={onClose}>
          <CloseIcon />
        </Box>
      </Box>
      <Divider></Divider>

      <Container
        sx={{
          py: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Full Name</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              value={selectedEnquiryData?.fullName}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Email</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              value={selectedEnquiryData?.email}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">TypeOfEvent</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              value={selectedEnquiryData?.typeOfEvent}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">GuestCount</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              value={selectedEnquiryData?.guestCount}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Mobile Number</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              value={selectedEnquiryData?.mobileNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1"> Enquiry Date</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              value={
                selectedEnquiryData?.eventDate
                  ? format(
                      new Date(selectedEnquiryData.eventDate),
                      "dd-MM-yyyy "
                    )
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Message</Typography>
            <TextField
              disabled
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={selectedEnquiryData?.message}
            />
          </Grid>
        </Grid>
      </Container>
    </Drawer>
  );
}

export default CateringEnquirieDrawer;
