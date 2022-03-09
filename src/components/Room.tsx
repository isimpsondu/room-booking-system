import { constants } from "ethers";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@material-ui/core";

interface Roomrops {
  reservations: Array<any>;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "Timeslot", sortable: false, flex: 6 },
  { field: "owner", headerName: "Owner", sortable: false, flex: 6 },
  {
    field: "",
    headerName: "Action",
    sortable: false,
    flex: 6,
    align: "center",
    renderCell: (params: GridRenderCellParams) => (
      <strong>
        <Button variant="contained" color="primary" size="small">
          Open
        </Button>
      </strong>
    ),
  },
];

export const Room = ({ reservations }: Roomrops) => {
  const timeslots = reservations.map((value, index) => {
    return {
      id: index,
      owner: value == constants.AddressZero ? null : value,
    };
  });
  return (
    <div style={{ height: 640, width: "100%" }}>
      <DataGrid disableColumnMenu rows={timeslots} columns={columns} />
    </div>
  );
};
