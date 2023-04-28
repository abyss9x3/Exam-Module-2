import React, { useState } from 'react'
import TableContainer from '../TableContainer/TableContainer';

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
    { id: 10, subNomenclature: "Roxie", subCode: "Harvey" },
    { id: 11, subNomenclature: "Roxie", subCode: "Harvey" },
    { id: 12, subNomenclature: "Roxie", subCode: "Harvey" },
    { id: 13, subNomenclature: "Roxie", subCode: "Harvey" },
    { id: 14, subNomenclature: "Roxie", subCode: "Harvey" },
    { id: 15, subNomenclature: "Roxie", subCode: "Harvey" }
];

const TableHandler = () => {
    const [rows, setRows] = useState(initialRows);

    const handleCommit = () => {
        console.log("Commit");
    }

    const handleSend = () => {
        console.log("Send");
    }

    return (
        <TableContainer
            handleCommit={handleCommit}
            handleSend={handleSend}
            rows={rows}
            setRows={setRows}
            show={["template", "syllabus", "examiner1", "examiner2", "commit", "addBtn", "commitBtn", "commitBtn"]}
        />
    )
}

export default TableHandler;
