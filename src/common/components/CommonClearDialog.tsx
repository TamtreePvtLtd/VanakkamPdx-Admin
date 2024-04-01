import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  dialogOpen: boolean;
  onDialogclose(): void;
  onDelete(): void;
  title: string;
  content: string;
}

function CommonClearDialog(props: IProps) {
  const { dialogOpen, onDialogclose, onDelete, title, content } = props;

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
            color="primary"
            size="small"
            sx={{
              color: "#038265",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            variant="contained"
            size="small"
            sx={{ "&:hover": { backgroundColor: "#038265" } }}
          >
            DeSelect
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommonClearDialog;
