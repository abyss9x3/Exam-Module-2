import React, { useContext, useState } from 'react'
import { SERVER_LINK } from './../../dev-server-link';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { DoneAll, Send, HourglassTop } from '@mui/icons-material';
import { Button } from "@mui/material"
import userContext from '../../store/user/userContext';
import { isUserExamController, isUserExamOfficer } from '../../store/user/userUtils';

const DeptBtn = ({ deptName, status }) => {
    return (
        <Button sx={{ margin: "0.4rem 0", width: "8rem" }} variant="outlined" color={status ? "success" : "secondary"} endIcon={status ? <DoneAll /> : null}>
            {deptName}
        </Button>
    );
}

const DeptSelectComponent = ({ deptNames, deptStatus, user }) => {

    const navigator = useNavigate();

    const handleClieck = (event, deptName) => {
        event.preventDefault();
        console.log(event);
        navigator(`/examoffice/table/${deptName}`);
    }

    const [loading, setLoading] = useState(false);

    const phaseOneCompletion = () => {

        if (loading) return;
        setLoading(true);

        fetch(`${SERVER_LINK}/api/explore/phase1end`, { method: "POST", credentials: "include" })
            .then(async res => {
                if (res.ok) return res.json()
                const json = await res.json();
                return await Promise.reject(json);
            })
            .then(res => {
                alert(res);
                setLoading(false)
            })
            .catch(err => {
                alert(err);
                setLoading(false);
            });
    }

    return (
        <section style={{ display: "flex", justifyContent: "space-evenly", alignItems: "flex-start" }}>
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
                <h1 style={{ padding: "1.5rem" }}>Select Department</h1>
                {deptNames.map((deptName, id) =>
                    <div onClick={event => handleClieck(event, deptName)} key={id}>
                        <DeptBtn deptName={deptName} status={deptStatus && deptStatus[deptName]} />
                    </div>
                )}
            </div>

            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
                {(user.phase === 1) && <>
                    <h1 style={{ padding: "1.5rem" }}>Done Filling Data ?</h1>
                    <Button variant="contained" sx={{ width: "9rem" }} endIcon={loading ? <HourglassTop /> : <Send />} onClick={phaseOneCompletion}>
                        Send
                    </Button>
                </>}
                {(isUserExamOfficer(user.designation)) && (user.phase === 3) && <>
                    <h1 style={{ padding: "1.5rem" }}>Done Checking Data ?</h1>
                    <Button variant="contained" sx={{ marginTop: "0.8rem", width: "9rem" }} endIcon={loading ? <HourglassTop /> : <Send />}>
                        Approve
                    </Button>
                </>}
                {(isUserExamController(user.designation)) && (user.phase === 4) && <>
                    <h1 style={{ padding: "1.5rem" }}>Done Checking Data ?</h1>
                    <Button variant="contained" sx={{ marginTop: "0.8rem", width: "9rem" }} endIcon={loading ? <HourglassTop /> : <Send />}>
                        Approve
                    </Button>
                </>}
            </div>
        </section>
    );
}

const DeptSelect = () => {

    const { user } = useContext(userContext);

    const { loading, error, value: deptNames } = useFetch(`${SERVER_LINK}/api/explore/deptNames`, { method: "GET" });
    let { loading: loadingStatus, value: deptStatus } = useFetch(`${SERVER_LINK}/api/explore/allDeptStatus`, { method: "GET" });

    if (user.phase === 1) {
        deptStatus = undefined;
    } else {
    }

    return (
        <div>

            {(loading || loadingStatus) ? <LoadingSpinner /> :
                (error ? <div>{JSON.stringify(error)}</div> : <DeptSelectComponent user={user} deptNames={deptNames} deptStatus={deptStatus} />)
            }
        </div>
    )
}


export default DeptSelect;
