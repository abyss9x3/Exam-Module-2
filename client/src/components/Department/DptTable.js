import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { SERVER_LINK } from "../../dev-server-link";
import useFetch from './../../hooks/useFetch';
import LoadingSpinner from './../LoadingSpinner/LoadingSpinner';
import { useNavigate, useParams } from 'react-router-dom'
import userContext from './../../store/user/userContext';
import { isUserHOD } from './../../store/user/userUtils';

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "subCode",
        headerName: "Subject Code",
        width: 150,
        // editable: true,
    },
    {
        field: "subNomenclature",
        headerName: "Subject Nomenclature",
        width: 150,
        // editable: true,
    },
    {
        field: "template",
        headerName: "Template",
        width: 110,
        // editable: true,
        renderCell: (params) => (
            <a href={params.value} target='_blank' rel='noopener noreferrer'>
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
                type='file'
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
        headerName: "Examiner 1 Email",
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
        headerName: "Examiner 2 Email",
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

export default function DeptTable() {

    const { user } = React.useContext(userContext);

    const params = useParams();
    const { value: rows, setValue: setRows, error, loading } = useFetch(`${SERVER_LINK}/api/explore/departmentTable?deptName=${params.deptName}`, { method: "GET", credentials: "include" });

    const commitClick = () => {
        fetch(`${SERVER_LINK}/api/explore/deptStatus?deptName=${params.deptName}`, { method: "PUT", credentials: "include" })
            .then(async res => {
                if (res.ok) return res.json()
                const json = await res.json();
                return await Promise.reject(json);
            })
            .then(res => {
                alert(JSON.stringify({ response: res, msg: "You have approved the examiners" }));
                window.location.href = '/'
            })
            .catch(err => {
                alert(JSON.stringify(err))
            });
    }


    if (loading) return <LoadingSpinner />
    else if (error) return JSON.stringify(error);
    return (
        <section>
            <DataGrid
                sx={{ alignItems: "center" }}
                rows={rows ? rows : []}
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
            {isUserHOD(user.designation) ?
                <button style={{
                    position: "absolute",
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    right: "0",
                }} onClick={commitClick}>Commit</button>
                : ""}
        </section>
    );
}
