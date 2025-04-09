import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface ConfirmChangeEstadoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmChangeEstadoModal({ open, onClose, onConfirm }: ConfirmChangeEstadoModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas cambiar el estado de esta factura?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
