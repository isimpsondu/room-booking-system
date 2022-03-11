import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Row } from "./Room";
import { useCancel } from "../hooks";
import { useNotifications } from "@usedapp/core";

interface ReserveProps {
  open: boolean;
  handleClose: () => void;
  data: Row;
}

export default function Reserve({ open, handleClose, data }: ReserveProps) {
  const { notifications } = useNotifications();

  const { send, state: cancelRoomState } = useCancel();

  const [showCancelRoomFailed, setShowCancelRoomFailed] = useState(false);
  const onClickConfirm = () => {
    send(data.roomIdx, data.id).then(() => {
      if (cancelRoomState.transaction === undefined) {
        setTimeout(() => {
          if (
            cancelRoomState.errorMessage &&
            cancelRoomState.errorMessage.trim().length > 0
          ) {
            setShowCancelRoomFailed(true);
          }
        }, 3000);
      }
    });
  };

  const isMining = cancelRoomState.status === "Mining";
  const [showCancelRoomSuccess, setShowCancelRoomSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowCancelRoomSuccess(false);
    setShowCancelRoomFailed(false);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Cancel room booking"
      ).length > 0
    ) {
      setShowCancelRoomSuccess(true);
      handleClose();
    }
  }, [notifications, showCancelRoomSuccess]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to cancel your booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickConfirm} color="primary" disabled={isMining}>
            {isMining ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showCancelRoomSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          You have successfully cancelled your booking
        </Alert>
      </Snackbar>
      <Snackbar
        open={showCancelRoomFailed}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="error">
          {cancelRoomState.errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
