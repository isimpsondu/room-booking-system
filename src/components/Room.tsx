import { useState } from "react";
import { constants } from "ethers";
import { useEthers } from "@usedapp/core"
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Reserve from "./Reserve";
import Cancel from "./Cancel";

interface RoomProps {
  roomIdx: number;
  reservations: Array<any>;
}

export interface Row {
  roomIdx: number;
  id: number;
  owner: String;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "Timeslot", sortable: false, flex: 6 },
  { field: "owner", headerName: "Owner", sortable: false, flex: 6 },
];

export const Room = ({ roomIdx, reservations }: RoomProps) => {
  const [openReserveDialog, setOpenReserveDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const defaultRow: Row = {
    roomIdx, id: 0, owner: ""
  };
  const [selectedRow, setSelectedRow] = useState<any>(defaultRow);
  const timeslots = reservations.map((value, index) => {
    const row: Row = {
      roomIdx,
      id: index,
      owner: value == constants.AddressZero ? null : value,
    };
    return row;
  });
  const { account } = useEthers()
  const onRowClick = (param: GridRowParams) => {
    const row = param.row;
    setSelectedRow(row);
    if (row.owner === null) {
      setOpenReserveDialog(true);
    } else if (row.owner == account) {
      setOpenCancelDialog(true);
    }
  };
  const handleReserveDialogClose = () => setOpenReserveDialog(false);
  const handleCancelDialogClose = () => setOpenCancelDialog(false);
  return (
    <div style={{ height: 640, width: "100%" }}>
      <DataGrid
        disableColumnMenu
        rows={timeslots}
        columns={columns}
        onRowClick={onRowClick}
      />
      <Reserve
        open={openReserveDialog}
        handleClose={handleReserveDialogClose}
        data={selectedRow}
      />
      <Cancel
        open={openCancelDialog}
        handleClose={handleCancelDialogClose}
        data={selectedRow}
      />
    </div>
  );
};
