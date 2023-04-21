import React from "react";

const Readonlyrow = ({ contact, handleEditClick }) => {
  return (
    <tr>
      <td>{contact.id}</td>
      <td>{contact.Subject_Code}</td>
      <td>{contact.Subject_Number}</td>
      <td>{contact.Template}</td>
      <button
        type='button'
        onClick={(event) => handleEditClick(event, contact)}
      >
        Edit
      </button>
    </tr>
  );
};

export default Readonlyrow;
