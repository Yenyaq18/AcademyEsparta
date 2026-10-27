import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { COLORS } from "../../utils/constants";

export default function Modal({ open, onClose, title, children, actions, maxWidth = "sm" }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          color: COLORS.navy,
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: COLORS.border }}>
        <Box sx={{ pt: 1 }}>{children}</Box>
      </DialogContent>
      {actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
}