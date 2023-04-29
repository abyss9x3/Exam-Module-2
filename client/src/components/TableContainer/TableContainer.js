import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import { AddCircle, Cancel, Delete, DoneAll, FileUpload, Send, UploadFile } from '@mui/icons-material';
import LoadingSpinner from './../LoadingSpinner/LoadingSpinner';
import { justFetch } from "../../hooks/useFetch";
import { SERVER_LINK } from "../../dev-server-link";

const TableContainer = ({ deptName, rows, setRows, loading, error, setError, show, editable, commitUrl }) => {

    const navigator = useNavigate();

    const [loadingStates, setLoadingStates] = useState({
        commitBtn: false, rowCommit: false, sendBtn: false
    });

    const handleCommit = () => {
        if (loadingStates.commitBtn) return;

        justFetch(
            commitUrl,
            {
                method: "POST", body: JSON.stringify({
                    deptName: deptName,
                    tableData: rows
                })
            },
            () => setLoadingStates(prev => ({ ...prev, commitBtn: true })),
            alert,
            setError,
            () => setLoadingStates(prev => ({ ...prev, commitBtn: false }))
        );
    }

    const handleSend = () => {
        if (loadingStates.sendBtn) return;

        justFetch(
            `${SERVER_LINK}/api/explore/deptStatus?deptName=${deptName}`,
            { method: "PUT" },
            () => setLoadingStates(prev => ({ ...prev, sendBtn: true })),
            alert,
            setError,
            () => setLoadingStates(prev => ({ ...prev, sendBtn: false }))
        );
    }

    const handleRowCommit = params => {
        if (loadingStates.rowCommit) return;

        justFetch(
            `${SERVER_LINK}/api/explore/commitRow`,
            {
                method: "POST", body: JSON.stringify({
                    deptName: deptName,
                    rowData: params.row
                })
            },
            () => setLoadingStates(prev => ({ ...prev, rowCommit: true })),
            alert,
            setError,
            () => setLoadingStates(prev => ({ ...prev, rowCommit: false }))
        );
    }

    const UploadFileComponent = useCallback((params, colName) => {
        return <Button
            sx={{ textTransform: "capitalize" }}
            variant="outlined"
            endIcon={params.row[colName] ? <UploadFile /> : < FileUpload />}
            component="label"
            color={params.row[colName] ? "success" : "info"}
        >
            {params.row[colName] ? "Change File" : "File"}
            <input
                hidden
                type="file"
                onChange={event => {
                    const file = event.target.files[0];
                    setRows(prev => prev.map((row) => {
                        if (row.id === params.id) {
                            row[colName] = file;
                            return { ...row };
                        } else {
                            return row;
                        }
                    }));
                }}
            />
        </Button >
    }, [setRows]);

    const handleAddRow = () => {
        // TODO: newId should be max of id + 1
        const newId = deptName.toLowerCase() + (rows.length + 1);
        setRows(prev => ([...prev, { id: newId }]));
    }

    const handleDeleteRow = id => {
        setRows(prev => prev.filter(row => row.id !== id));
    }

    const handleCancel = () => {
        navigator('/');
    }

    const columns = useMemo(() => {
        let colArr = [];

        show && show.includes("deleteBtn") && colArr.push({
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: params => [
                <GridActionsCellItem
                    icon={<Delete color="error" />}
                    label="Delete"
                    onClick={() => handleDeleteRow(params.id)}
                />
            ]
        });

        colArr = [
            ...colArr,
            {
                field: "id",
                headerName: "ID",
                width: 80,
                editable: false
            },
            {
                field: "subCode",
                headerName: "Subject Code",
                width: 150,
                editable: editable.includes("SC")
            },
            {
                field: "subNomenclature",
                headerName: "Subject Nomenclature",
                width: 195,
                editable: editable.includes("SN")
            }
        ];

        if (!show || !show.length) return colArr;

        show.includes("T") && colArr.push({
            field: "template",
            headerName: "Template",
            width: 150,
            editable: editable.includes("T"),
            renderCell: params => UploadFileComponent(params, 'template')
        })

        show.includes("SYLL") && colArr.push({
            field: "syllabus",
            headerName: "Syllabus",
            width: 150,
            editable: editable.includes("SYLL"),
            renderCell: params => UploadFileComponent(params, 'syllabus')
        })

        show.includes("E1") && colArr.push({
            field: "examiner1_name",
            headerName: "Examiner1 Name",
            width: 145,
            editable: editable.includes("E1"),
        })

        show.includes("E1") && colArr.push({
            field: "examiner1_contactNo",
            headerName: "Examiner1 ContactNo",
            width: 180,
            editable: editable.includes("E1"),
        })

        show.includes("E1") && colArr.push({
            field: "examiner1_email",
            headerName: "Examiner1 Email",
            width: 145,
            editable: editable.includes("E1"),
        })

        show.includes("E2") && colArr.push({
            field: "examiner2_name",
            headerName: "Examiner2 Name",
            width: 155,
            editable: editable.includes("E2"),
        })

        show.includes("E2") && colArr.push({
            field: "examiner2_contactNo",
            headerName: "Examiner2 ContactNo",
            width: 185,
            editable: editable.includes("E2"),
        })

        show.includes("E2") && colArr.push({
            field: "examiner2_email",
            headerName: "Examiner2 Email",
            width: 150,
            editable: editable.includes("E2"),
        })

        show.includes("rowCommit") && colArr.push({
            field: "commit",
            headerName: "Commit",
            width: 220,
            renderCell: params => (
                params.row.member ? <Box color="rgb(46 125 50)">Commited by {params.row.member}</Box> : <Button
                    sx={{ textTransform: "capitalize" }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRowCommit(params)}
                >
                    Commit
                </Button>
            ),
        })

        return colArr;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UploadFileComponent, editable, show]);

    if (loading) {
        return <LoadingSpinner />
    } else if (error) {
        return <div>{JSON.stringify(error)}</div>
    }
    else return (
        <section>
            {rows && <DataGrid
                sx={{
                    maxHeight: "75vh",
                    margin: "12px 18px",
                    "& .MuiDataGrid-iconButtonContainer": {
                        display: "none"
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontSize: "1rem",
                        fontFamily: "Overpass"
                    },
                    "& .MuiDataGrid-cell": {
                        borderRight: "1px solid rgba(224, 224, 224, 1)"
                    }
                }}
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                disableColumnMenu
                disableColumnSort
                sortColumnDirection="asc"
                hideFooterPagination
                hideFooter
                disableAddRow
                processRowUpdate={newRow => {
                    setRows(prev => prev.map((row) => (
                        row.id === newRow.id ? { ...newRow } : row
                    )));
                    return newRow;
                }}
            />}
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    right: '0',
                    padding: "12px 18px 0 12px"
                }}
            >
                {show && show.includes("addBtn") && <Button
                    variant="contained"
                    color="info"
                    sx={btnStyles}
                    onClick={handleAddRow}
                    endIcon={<AddCircle />}
                >
                    Add Row
                </Button>}
                {show && show.includes("commitBtn") && <Button
                    variant="contained"
                    color="success"
                    sx={btnStyles}
                    onClick={handleCommit}
                    endIcon={<DoneAll />}
                >
                    Commit
                </Button>}
                <Button
                    variant="contained"
                    color="warning"
                    sx={btnStyles}
                    onClick={handleCancel}
                    endIcon={<Cancel />}
                >
                    Cancel
                </Button>
                {show && show.includes("sendBtn") && <Button
                    variant="contained"
                    color="secondary"
                    sx={btnStyles}
                    onClick={handleSend}
                    endIcon={<Send />}
                >
                    Send
                </Button>}
            </Box>
        </section>
    );
}

const btnStyles = {
    textTransform: "capitalize",
    fontSize: "1.2rem",
    marginLeft: "1rem"
};

export default TableContainer;
