import React from "react";

const Editablerow = ({ contact, editFormData, handleEditFormChange }) => {
  return (
    <tr>
      <td>{contact.id}</td>
      <td>{contact.Subject_Code}</td>
      <td>{contact.Subject_Number}</td>
      <td>{contact.Template}</td>
      <td>
        <input
          type='text'
          name='Syllabus'
          required='required'
          placeholder='Enter Syllabus'
          value={editFormData.Syllabus}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          name='Examiner1'
          required='required'
          placeholder='Enter Examiner1 name'
          value={editFormData.Examiner1}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          name='Examiner2'
          required='required'
          placeholder='Enter Examiner2 name'
          value={editFormData.Examiner2}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <button type='Save'>Commit</button>
      </td>
    </tr>
  );
};

export default Editablerow;
