import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "subCode",
    headerName: "Subject Code",
    width: 150,
    editable: true,
  },
  {
    field: "subNomenclature",
    headerName: "Subject Nomenclature",
    width: 150,
    editable: true,
  },
  {
    field: "template",
    headerName: "Template",
    width: 110,
    // editable: true,
    renderCell: (params) => (
      <input
        type="file"
        onChange={(event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const dataUrl = reader.result;
            params.setValue(dataUrl);
          };
        }}
      />
    ),
  },
  {
    field: "syllabus",
    headerName: "Syllabus",
    width: 110,
    // editable: true,
    renderCell: (params) => (
      <input
        type="file"
        onChange={(event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const dataUrl = reader.result;
            params.setValue(dataUrl);
          };
        }}
      />
    ),
  },
  {
    field: "examiner1_name",
    headerName: "Examiner2 Name",
    width: 110,
    editable: true,
  },
  {
    field: "examiner1_contactNo",
    headerName: "Examiner1 ContactNo",
    width: 110,
    editable: true,
  },
  {
    field: "examiner1_email",
    headerName: "Examiner1 Email",
    width: 110,
    editable: true,
  },
  {
    field: "examiner2_name",
    headerName: "Examiner2 Name",
    width: 110,
    editable: true,
  },
  {
    field: "examiner2_contactNo",
    headerName: "Examiner2 ContactNo",
    width: 110,
    editable: true,
  },
  {
    field: "examiner2_email",
    headerName: "Examiner2 Email",
    width: 110,
    editable: true,
  },
  //   {
  //     field: "commit",
  //     headerName: "Commit",
  //     width: 110,
  //     renderCell: (params) => (
  //       <button onClick={() => console.log(`Commit row ${params.row.id}`)}>
  //         Commit
  //       </button>
  //     ),
  //   },
];

const initialRows = [
  { id: 1, subNomenclature: "Snow", subCode: "Jon" },
  { id: 2, subNomenclature: "Lannister", subCode: "Cersei" },
  { id: 3, subNomenclature: "Lannister", subCode: "Jaime" },
  { id: 4, subNomenclature: "Stark", subCode: "Arya" },
  { id: 5, subNomenclature: "Targaryen", subCode: "Daenerys" },
  { id: 6, subNomenclature: "Melisandre", subCode: "Lady" },
  { id: 7, subNomenclature: "Clifford", subCode: "Ferrara" },
  { id: 8, subNomenclature: "Frances", subCode: "Rossini" },
  { id: 9, subNomenclature: "Roxie", subCode: "Harvey" },
];

export default function EOphase3() {
  const [rows, setRows] = React.useState(initialRows);
  //   const handleAddRow = () => {
  //     const newId = rows.length + 1;
  //     setRows([
  //       ...rows,
  //       { id: newId, subNomenclature: "", subCode: "", null },
  //     ]);
  //   };
  // const handleAddRow = () => {
  //   const newId = rows.length + 1;
  //   setRows([
  //     ...rows,
  //     { id: newId, subNomenclature: "", subCode: "", null },
  //   ]);
  // };


  return (
    <>
      <DataGrid
        sx={{ alignItems: "center" }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        disableColumnMenu
        disableColumnSort
        sortColumnDirection="asc"
        hideFooterPagination
        disableAddRow={true}
        onEditCellChangeCommitted={(params, event) => {
          const { id, field, value } = params;
          setRows(
            rows.map((row) =>
              row.id === id ? { ...row, [field]: value } : row
            )
          );
        }}
      />
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          right: '0'
        }}
      >
        <button onClick={() => console.log("Commit")}>Commit</button>
      </Box>
    </>
  );
}
