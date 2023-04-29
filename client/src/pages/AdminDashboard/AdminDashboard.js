import { Button } from '@mui/material';
import React, { useContext } from 'react'
import { justFetch } from '../../hooks/useFetch';
import { SERVER_LINK } from './../../dev-server-link';
import { isUserAdmin } from './../../store/user/userUtils';
import userContext from './../../store/user/userContext';

const AdminDashboard = () => {

    const { user } = useContext(userContext);

    const handleDeleteDatabase = () => {
        if (window.confirm("Are you sure ! This action will clear whole database !")) {
            justFetch(
                `${SERVER_LINK}/api/explore`,
                { method: "DELETE" },
                () => alert("Deleting Database !"),
                alert,
                alert,
                null
            )
        }
    }

    const handleDownloadExcelSheet = () => {
        window.open(`${SERVER_LINK}/api/explore/excelSheet`, '_blank');
    }

    const handleSendAppointmentLetters = () => {
        if (window.confirm("Are you sure ! This action will send appointment letter mail to every examiner filled in database !")) {
            justFetch(
                `${SERVER_LINK}/api/explore/sendAppointmentLetters`,
                { method: "GET" },
                () => alert("Sending Appointment Mails !"),
                res => alert(JSON.stringify(res)),
                err => alert(JSON.stringify(err)),
                null
            )
        }
    }

    if (!isUserAdmin(user.designation)) {
        return <div>You are not authorized to view this page !</div>
    }
    else return (
        <section style={styles.section}>
            <h1 style={{ ...styles.layout, ...styles.h1 }}>Admin Dashboard</h1>

            <div>
                <Button
                    style={styles.layout}
                    href='/signup'
                    variant='contained'
                    color='info'
                >Add New User</Button>
            </div>

            <div>
                <Button
                    style={styles.layout}
                    onClick={handleDownloadExcelSheet}
                    variant='contained'
                    color='info'
                >Download Excel Sheet</Button>
            </div>

            <div>
                <Button
                    style={styles.layout}
                    onClick={handleSendAppointmentLetters}
                    variant='contained'
                    color='warning'
                >Send Appointment Letters</Button>
            </div>

            <div>
                <Button
                    style={styles.layout}
                    onClick={handleDeleteDatabase}
                    variant='contained'
                    color='error'
                >Delete Database</Button>
            </div>

        </section>
    )
}

const styles = {
    section: {
        display: "flex",
        flexDirection: "column"
    },
    h1: {
        marginBottom: "1rem"
    },
    layout: {
        marginTop: "1.5rem",
        textTransform: "capitalize"
    }
};

export default AdminDashboard;
