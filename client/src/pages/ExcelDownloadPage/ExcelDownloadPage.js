import React, { useContext } from 'react'
import userContext from '../../store/user/userContext';
import { isUserAdmin, isUserExamController, isUserExamOfficer } from '../../store/user/userUtils';
import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { SERVER_LINK } from '../../dev-server-link';

const ExcelDownloadPage = () => {
    const { user } = useContext(userContext);

    if (!isUserExamOfficer(user.designation) && !isUserExamController(user.designation) && !isUserAdmin(user.designation)) {
        return <div>{user.designation} is not authorized to download ExcelSheet !</div>
    } else if (user.phase !== 5) {
        return <div>The process is not completed yet hence can't download ExcelSheet yet !</div>
    }

    const downloadSheet = () => {
        window.open(`${SERVER_LINK}/api/explore/excelSheet`, '_blank');
    }

    return (
        <Button
            variant="contained"
            color='success'
            size='large'
            endIcon={<Download />}
            onClick={downloadSheet}
        >
            Download Excel Sheet
        </Button>
    )
}

export default ExcelDownloadPage;
