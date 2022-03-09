import { makeStyles } from "@material-ui/core";
import { useRooms } from "../hooks";
import { RoomList } from "./RoomList";

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.black,
    textAlign: "center",
    padding: theme.spacing(4),
  },
}));

export const Main = () => {
  const classes = useStyles();

  const rooms = (useRooms() as any[]) ?? [];

  return (
    <>
      <h2 className={classes.title}>Room Booking App</h2>
      <RoomList rooms={rooms} />
    </>
  );
};
