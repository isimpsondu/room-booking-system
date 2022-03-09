import React, { useState } from "react";
import { Tab, makeStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Room } from "./Room";

interface RoomListProps {
  rooms: Array<any>;
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.black,
    textAlign: "center",
    padding: theme.spacing(4),
  },
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    borderRadius: "25px",
  },
}));

export const RoomList = ({ rooms }: RoomListProps) => {
  const classes = useStyles();

  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedRoomIndex(parseInt(newValue));
  };

  return (
    <>
      <TabContext value={selectedRoomIndex.toString()}>
        <TabList
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {rooms.map((_, index) => {
            return (
              <Tab
                label={"Room" + index}
                value={index.toString()}
                key={index}
              />
            );
          })}
        </TabList>
        {rooms.map((value, index) => {
          return (
            <TabPanel value={index.toString()} key={index}>
              <div className={classes.tabContent}>
                <Room reservations={value.reservations} />
              </div>
            </TabPanel>
          );
        })}
      </TabContext>
    </>
  );
};
