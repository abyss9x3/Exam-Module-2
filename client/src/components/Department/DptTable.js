import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import './style.css'

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "Subject_Code",
    headerName: "Subject Code",
    width: 150,
    // editable: true,
  },
  {
    field: "Subject_Number",
    headerName: "Subject Number",
    width: 150,
    // editable: true,
  },
  {
    field: "template",
    headerName: "Template",
    width: 110,
    // editable: true,
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    ),
  },
  {
    field: "syllabus",
    headerName: "Syllabus",
    width: 110,
    editable: true,
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
    field: "examiner-1",
    headerName: "Examiner 1",
    width: 110,
    editable: true,
  },
  {
    field: "examiner-2",
    headerName: "Examiner 2",
    width: 110,
    editable: true,
  },
  {
    field: "commit",
    headerName: "Commit",
    width: 110,
    renderCell: (params) => (
      <button onClick={() => console.log(`Commit row ${params.row.id}`)}>
        Commit
      </button>
    ),
  },
];

const initialRows = [
  { id: 1, Subject_Number: "Snow", Subject_Code: "Jon" },
  { id: 2, Subject_Number: "Lannister", Subject_Code: "Cersei" },
  { id: 3, Subject_Number: "Lannister", Subject_Code: "Jaime" },
  { id: 4, Subject_Number: "Stark", Subject_Code: "Arya" },
  {
    id: 5,
    Subject_Number: "Targaryen",
    Subject_Code: "Daenerys",

  },
  { id: 6, Subject_Number: "Melisandre", Subject_Code: "Lady" },
  { id: 7, Subject_Number: "Clifford", Subject_Code: "Ferrara" },
  { id: 8, Subject_Number: "Frances", Subject_Code: "Rossini" },
  { id: 9, Subject_Number: "Roxie", Subject_Code: "Harvey" },
];

export default function DeptTable() {
  const [rows, setRows] = React.useState(initialRows);

  // const handleAddRow = () => {
  //   const newId = rows.length + 1;
  //   setRows([
  //     ...rows,
  //     { id: newId, Subject_Number: "", Subject_Code: "", null },
  //   ]);
  // };

  const data = React.useMemo(
    () =>
      rows.map(({ id, Subject_Code, Subject_Number, template }) => ({
        id,
        Subject_Code,
        Subject_Number,
        template,
      })),
    [rows]
  );

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
          right: "0",
        }}
      >
        {/* <button onClick={() => console.log("Commit")}>Commit</button> */}
      </Box>
      {/* <div sx={{ alignItems: "center" }}>
        <button onClick={handleAddRow}>Add Row</button>
      </div> */}
    </>
  );
}

// import { useState } from "react";

// function Table() {
//   const [data, setData] = useState([
//     {
//       id: 1,
//       Subject_Code: "John Doe",
//       Subject_Number: "johndoe@example.com",
//       Template: "abcd",
//     },
//     {
//       id: 2,
//       Subject_Code: "Jane Doe",
//       Subject_Number: "janedoe@example.com",
//       Template: "abcd",
//     },
//     {
//       id: 3,
//       Subject_Code: "Bob Smith",
//       Subject_Number: "bobsmith@example.com",
//       Template: "abcd",
//     },
//   ]);

//   const handleCellChange = (event, rowIndex, property) => {
//     const newData = [...data];
//     newData[rowIndex][property] = event.target.value;
//     setData(newData);
//   };

//   return (
//     <div className="app-container">
//       <center>
//         <table>
//           <thead>
//             <tr>
//               <th>Id</th>
//               <th>Subject Code</th>
//               <th>Subject Number</th>
//               <th>Template</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={row.id}>
//                 <td>{row.id}</td>
//                 <td>
//                   <input
//                     type="text"
//                     value={row.Subject_Code}
//                     onChange={(event) =>
//                       handleCellChange(event, rowIndex, "Subject_Code")
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={row.Subject_Number}
//                     onChange={(event) =>
//                       handleCellChange(event, rowIndex, "Subject_Number")
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={row.Template}
//                     onChange={(event) =>
//                       handleCellChange(event, rowIndex, "Template")
//                     }
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </center>
//     </div>
//   );
// }

// export default Table;
