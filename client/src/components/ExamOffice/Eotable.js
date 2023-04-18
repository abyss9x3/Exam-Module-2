import React, { useState } from "react";
import "./style.css";
import data from "./mock-data.json";

const Table = () => {
  const [contacts, setContacts] = useState(data);
  const [addFormData, setAddFormData] = useState({
    id: '',
    Subject_Code: '',
    Subject_Number: '',
    Template: ''
  })
  const handleAddFormChange = (event) =>{
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue=event.target.value;

    const newFormData = { ...addFormData }
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  }
  return (
    <div className="app-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Subject Code</th>
            <th>Subject Number</th>
            <th>Template</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr>
              <td>{contact.id}</td>
              <td>{contact.Subject_Code}</td>
              <td>{contact.Subject_Number}</td>
              <td>{contact.Template}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Add a Subject</h2>
      <form>
        <input
          type="number"
          name="id"
          required="required"
          placeholder="Enter id"
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="Subject_Code"
          required="required"
          placeholder="Enter Subject Code"
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="Subject_Number"
          required="required"
          placeholder="Enter Subject Number"
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="Subject_Code"
          required="required"
          placeholder="Enter Template"
          onChange={handleAddFormChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Table;
