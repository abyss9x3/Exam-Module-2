import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'Subject_Code',
    headerName: 'Subject Code',
    width: 150,
    editable: true,
  },
  {
    field: 'Subject_Number',
    headerName: 'Subject Number',
    width: 150,
    editable: true,
  },
  {
    field: 'template',
    headerName: 'Template',
    width: 110,
    editable: true,
  },
];

const rows = [
  { id: 1, Subject_Number: 'Snow', Subject_Code: 'Jon', template: 35 },
  { id: 2, Subject_Number: 'Lannister', Subject_Code: 'Cersei', template: 42 },
  { id: 3, Subject_Number: 'Lannister', Subject_Code: 'Jaime', template: 45 },
  { id: 4, Subject_Number: 'Stark', Subject_Code: 'Arya', template: 16 },
  { id: 5, Subject_Number: 'Targaryen', Subject_Code: 'Daenerys', template: null },
  { id: 6, Subject_Number: 'Melisandre', Subject_Code: null, template: 150 },
  { id: 7, Subject_Number: 'Clifford', Subject_Code: 'Ferrara', template: 44 },
  { id: 8, Subject_Number: 'Frances', Subject_Code: 'Rossini', template: 36 },
  { id: 9, Subject_Number: 'Roxie', Subject_Code: 'Harvey', template: 65 },
];

export default function DataGridDemo() {
  return (
    // <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        sx={{ alignItems: 'center' }}
        rows={rows}
        columns={columns}
        ptemplateSize={5}
        rowsPerPtemplateOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    // </Box>
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
