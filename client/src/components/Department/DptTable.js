import React, { useState, Fragment } from "react";
import "./style.css";
import { nanoid } from "nanoid";
import data from "./mock-data.json";
import Readonlyrow from "./Readonlyrow";
import Editablerow from "./Editablerow";
const DeptTable = () => {
  const [contacts, setContacts] = useState(data);

  const [editFormData, setEditFormData] = useState({
    id: "",
    Subject_Code: "",
    Subject_Number: "",
    Template: "",
    Syllabus: "",
    Examiner1: "",
    Examiner2: "",
  });

  const [editContactId, setEditContactID] = useState(null);

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const index = contacts.findIndex((contact) => contact.id === editContactId);
    const editedContact = {
      id: editContactId,
      Subject_Code: contacts[index].Subject_Code,
      Subject_Number: contacts[index].Subject_Number,
      Template: contacts[index].Template,
      Syllabus: editFormData.Syllabus,
      Examiner1: editFormData.Examiner1,
      Examiner2: editFormData.Examiner2,
    };
    const newContacts = [...contacts];

    newContacts[index] = editedContact;
    setContacts(newContacts);
    setEditContactID(null);
  };
  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactID(contact.id);
    const formValues = {
      Syllabus: contact.Syllabus,
      Examiner1: contact.Examiner1,
      Examiner2: contact.Examiner2,
    };
    setEditFormData(formValues);
  };
  return (
    <div className='app-container'>
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Subject Code</th>
              <th>Subject Number</th>
              <th>Template</th>
              <th>Syllabus</th>
              <th>Examiner1</th>
              <th>Examiner2</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <Fragment>
                {editContactId === contact.id ? (
                  <Editablerow
                    contact={contact}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                  />
                ) : (
                  <Readonlyrow
                    contact={contact}
                    handleEditClick={handleEditClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default DeptTable;
