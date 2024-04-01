import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IProps {
  dialogOpen: boolean;
  onDialogclose(): void;
  onSave(): void;
  title: string;
  content: string;
}
import CloseIcon from "@mui/icons-material/Close";

function CommonSaveDialog(props: IProps) {
  const { dialogOpen, onDialogclose, onSave, title, content } = props;
  return (
    <>
      <Dialog open={dialogOpen} onClose={onDialogclose}>
        <DialogTitle>
          {title}
          <CloseIcon
            onClick={onDialogclose}
            sx={{ cursor: "pointer", float: "right" }}
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onDialogclose}
            variant="outlined"
            sx={{
              "&:hover": { backgroundColor: "transparent" },
              color: "#038265",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            variant="contained"
            sx={{
              backgroundColor: "#038265",
              "&:hover": { backgroundColor: "#038265" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommonSaveDialog;
