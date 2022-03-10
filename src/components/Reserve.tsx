import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Row } from "./Room";
import { useReserve } from "../hooks";

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

  const [hour, setHour] = useState<number>(1);
  const handleHourInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newHour = Number(event.target.value);
    setHour(newHour);
  };

  const { send } = useReserve();

  const onClickConfirm = () => {
    send(data.roomIdx, data.id, hour);
    handleClose();
  };

  return (
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
          Please enter how many hours you want to reserve.
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
            defaultValue={1}
            onChange={handleHourInputChange}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
