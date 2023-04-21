import { useState } from 'react';

function Table() {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
    { id: 3, name: 'Bob Smith', email: 'bobsmith@example.com' },
  ]);
  
  const handleCellChange = (event, rowIndex, property) => {
    const newData = [...data];
    newData[rowIndex][property] = event.target.value;
    setData(newData);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>
              <input type="text" value={row.name} onChange={event => handleCellChange(event, rowIndex, 'name')} />
            </td>
            <td>
              <input type="text" value={row.email} onChange={event => handleCellChange(event, rowIndex, 'email')} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;




// import React, { useState, useEffect } from "react";
// import "./style.css";
// import data from "./mock-data.json";

// const Table = () => {
//   const [contacts, setContacts] = useState(data);
//   const [addFormData, setAddFormData] = useState({
//     Subject_Code: '',
//     Subject_Number: '',
//     Template: ''
//   })
//   const [id, setId]=useState([0]);

//   // Retrieve the last ID number from the server using useEffect
//   useEffect(() => {
//     fetch('/api/get_last_id')
//       .then(response => response.json())
//       .then(data => setId(data.lastId + 1))
//       .catch(error => console.log(error));
//   }, []);


//   const handleAddFormChange = (event) =>{
//     event.preventDefault();

//     const fieldName = event.target.getAttribute('name');
//     const fieldValue=event.target.value;

//     const newFormData = { ...addFormData }
//     newFormData[fieldName] = fieldValue;

//     setAddFormData(newFormData);
//   }
//   return (
//     <div className="app-container">
//       <table>
//         <thead>
//           <tr>
//             <th>Id</th>
//             <th>Subject Code</th>
//             <th>Subject Number</th>
//             <th>Template</th>
//           </tr>
//         </thead>
//         <tbody>
//           {contacts.map((contact) => (
//             <tr key={contact.id}>
//               <td>{contact.id}</td>
//               <td>{contact.Subject_Code}</td>
//               <td>{contact.Subject_Number}</td>
//               <td>{contact.Template}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h2>Add a Subject</h2>
//       <form>
//         <input
//           type="number"
//           name="id"
//           required="required"
//           placeholder="Enter id"
//           onChange={handleAddFormChange}
//         />
//         <input
//           type="text"
//           name="Subject_Code"
//           required="required"
//           placeholder="Enter Subject Code"
//           onChange={handleAddFormChange}
//         />
//         <input
//           type="text"
//           name="Subject_Number"
//           required="required"
//           placeholder="Enter Subject Number"
//           onChange={handleAddFormChange}
//         />
//         <input
//           type="text"
//           name="Subject_Code"
//           required="required"
//           placeholder="Enter Template"
//           onChange={handleAddFormChange}
//         />
//         <button type="submit">Add</button>
//       </form>
//     </div>
//   );
// };

// export default Table;
