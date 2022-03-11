import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Row } from "./Room";
import { useReserve } from "../hooks";
import { useNotifications } from "@usedapp/core";

interface ReserveProps {
  open: boolean;
  handleClose: () => void;
  data: Row;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function Reserve({ open, handleClose, data }: ReserveProps) {
  const classes = useStyles();
  const { notifications } = useNotifications();

  const [hour, setHour] = useState<number>(1);
  const handleHourInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newHour = Number(event.target.value);
    setHour(newHour);
  };

  const { send, state: reserveRoomState } = useReserve();

  const [showReserveRoomFailed, setShowReserveRoomFailed] = useState(false);
  const onClickConfirm = () => {
    send(data.roomIdx, data.id, hour).then(() => {
      if (reserveRoomState.transaction === undefined) {
        setTimeout(() => {
          if (
            reserveRoomState.errorMessage &&
            reserveRoomState.errorMessage.trim().length > 0
          ) {
            setShowReserveRoomFailed(true);
          }
        }, 3000);
      }
    });
  };

  const isMining = reserveRoomState.status === "Mining";
  const [showReserveRoomSuccess, setShowReserveRoomSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowReserveRoomSuccess(false);
    setShowReserveRoomFailed(false);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Reserve room booking"
      ).length > 0
    ) {
      setShowReserveRoomSuccess(true);
      handleClose();
    }
  }, [notifications, showReserveRoomSuccess]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Reserve Room{data.roomIdx}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter how many hours you want to reserve
          </DialogContentText>
          <form className={classes.root} autoComplete="off">
            <TextField
              disabled
              id="outlined-number"
              label="Timeslot"
              type="number"
              variant="outlined"
              defaultValue={data.id}
            />
            <TextField
              id="outlined-number"
              label="Hours"
              type="number"
              variant="outlined"
              defaultValue={hour}
              onChange={handleHourInputChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickConfirm} color="primary" disabled={isMining}>
            {isMining ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showReserveRoomSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          You have successfully booked the room
        </Alert>
      </Snackbar>
      <Snackbar
        open={showReserveRoomFailed}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="error">
          {reserveRoomState.errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
