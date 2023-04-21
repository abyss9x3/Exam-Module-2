import React from "react";

const Editablerow = ({ contact, editFormData, handleEditFormChange }) => {
  return (
    <tr>
      <td>
        <input
          type='id'
          name='id'
          required='required'
          placeholder='Enter id'
          value={editFormData.id}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          name='Subject_Code'
          required='required'
          placeholder='Enter Subject Code'
          value={editFormData.Subject_Code}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          name='Subject_Number'
          required='required'
          placeholder='Enter Subject Number'
          value={editFormData.Subject_Number}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          name='Template'
          required='required'
          placeholder='Enter Template'
          value={editFormData.Template}
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
