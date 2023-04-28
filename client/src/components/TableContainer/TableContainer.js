import React, { useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import { AddCircle, Cancel, DoneAll, FileUpload, Send, UploadFile } from '@mui/icons-material';


const TableContainer = ({ rows, setRows, show, handleCommit, handleSend }) => {

    const UploadFileComponent = useCallback((params, colName) => {
        console.log(params);
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

    const columns = useMemo(() => {
        const colArr = [
            {
                field: "id",
                headerName: "ID",
                width: 90,
                editable: false
            },
            {
                field: "subCode",
                headerName: "Subject Code",
                width: 150,
                editable: true,
            },
            {
                field: "subNomenclature",
                headerName: "Subject Nomenclature",
                width: 170,
                editable: true,
            },
        ];

        if (!show || !show.length) return colArr;

        show.includes("template") && colArr.push({
            field: "template",
            headerName: "Template",
            width: 150,
            editable: false,
            renderCell: params => UploadFileComponent(params, 'template')
        })

        show.includes("syllabus") && colArr.push({
            field: "syllabus",
            headerName: "Syllabus",
            width: 150,
            editable: false,
            renderCell: params => UploadFileComponent(params, 'syllabus')
        })

        show.includes("examiner1") && colArr.push({
            field: "examiner1_name",
            headerName: "Examiner1 Name",
            width: 145,
            editable: true,
        })

        show.includes("examiner1") && colArr.push({
            field: "examiner1_contactNo",
            headerName: "Examiner1 ContactNo",
            width: 160,
            editable: true,
        })

        show.includes("examiner1") && colArr.push({
            field: "examiner1_email",
            headerName: "Examiner1 Email",
            width: 145,
            editable: true,
        })

        show.includes("examiner2") && colArr.push({
            field: "examiner2_name",
            headerName: "Examiner2 Name",
            width: 145,
            editable: true,
        })

        show.includes("examiner2") && colArr.push({
            field: "examiner2_contactNo",
            headerName: "Examiner2 ContactNo",
            width: 160,
            editable: true,
        })

        show.includes("examiner2") && colArr.push({
            field: "examiner2_email",
            headerName: "Examiner2 Email",
            width: 145,
            editable: true,
        })

        show.includes("commit") && colArr.push({
            field: "commit",
            headerName: "Commit",
            width: 200,
            renderCell: (params) => (
                <Button
                    sx={{ textTransform: "capitalize" }}
                    variant="outlined"
                    color="warning"
                    onClick={() => console.log(`Commit row ${params.row.id}`)}
                >
                    Commit
                </Button>
            ),
        })

        return colArr;
    }, [UploadFileComponent, show]);

    const handleAddRow = () => {
        const newId = rows.length + 1;
        setRows([...rows, { id: newId }]);
    }

    return (
        <section>
            {rows && <DataGrid
                sx={{ maxHeight: "75vh", margin: "12px 18px" }}
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                disableColumnMenu
                disableColumnSort
                sortColumnDirection="asc"
                hideFooterPagination
                hideFooter
                disableAddRow
                onEditCellChangeCommitted={(params, event) => {
                    const { id, field, value } = params;
                    setRows(
                        rows.map((row) =>
                            row.id === id ? { ...row, [field]: value } : row
                        )
                    );
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
                    onClick={() => window.location.reload()}
                    endIcon={<Cancel />}
                >
                    Cancel
                </Button>
                {show && show.includes("commitBtn") && <Button
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
