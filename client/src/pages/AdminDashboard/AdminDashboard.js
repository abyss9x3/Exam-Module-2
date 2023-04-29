import { Button } from '@mui/material';
import React from 'react'

const AdminDashboard = () => {
    return (
        <section>
            <div>AdminDashboard</div>
            <Button
                href='/signup'
                variant='outlined'
                color='warning'
            >Add New User</Button>
        </section>
    )
}

export default AdminDashboard;