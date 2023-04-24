import React, { useContext, useState } from 'react'
import { SERVER_LINK } from './../../dev-server-link';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { DoneAll, Send, HourglassTop, TaskAlt } from '@mui/icons-material';
import { Button } from "@mui/material"
import userContext from '../../store/user/userContext';
import { isUserExamController, isUserExamOfficer } from '../../store/user/userUtils';

const DeptBtn = ({ deptName, status, onClick }) => {
    return (
        <Button onClick={onClick} sx={{ width: "8rem" }} variant="outlined" color={status ? "success" : "secondary"} endIcon={status ? <DoneAll /> : null}>
            {deptName}
        </Button>
    );
}

const DeptSelectComponent = ({ deptNames, deptStatus, user, approval1 }) => {

    const navigator = useNavigate();
    const [loading, setLoading] = useState({
        send: false, approval1: {}, approval2: {}
    });

    const handleDeptBtnClick = (event, deptName) => {
        event.preventDefault();
        navigator(`/examoffice/table/${deptName}`);
    }
    const handleApproval1Click = (event, deptName) => {
        event.preventDefault();

        setLoading(prev => {
            prev.approval1[deptName] = true;
            return { send: prev.send, approval1: { ...prev.approval1 }, approval2: { ...prev.approval2 } }
        })
        fetch(`${SERVER_LINK}/api/explore/approval1?deptName=${deptName}`, { method: "PUT", credentials: "include" })
            .then(async res => {
                if (res.ok) return res.json()
                const json = await res.json();
                return await Promise.reject(json);
            })
            .then(res => {
                alert(res);
            })
            .catch(err => {
                alert(JSON.stringify(err));
            }).finally(() => {
                setLoading(prev => {
                    prev.approval1[deptName] = false;
                    return { send: prev.send, approval1: { ...prev.approval1 }, approval2: { ...prev.approval2 } }
                })
            });
    }
    const handleApproval2Click = (event, deptName) => {
        event.preventDefault();
        console.log(`Approval 1 for ${deptName}`);
    }


    const phaseOneCompletion = () => {

        if (loading.send) return;
        setLoading(prev => {
            prev.send = true;
            return { send: prev.send, approval1: { ...prev.approval1 }, approval2: { ...prev.approval2 } }
        })

        fetch(`${SERVER_LINK}/api/explore/phase1end`, { method: "POST", credentials: "include" })
            .then(async res => {
                if (res.ok) return res.json()
                const json = await res.json();
                return await Promise.reject(json);
            })
            .then(res => {
                alert(res);
            })
            .catch(err => {
                alert(JSON.stringify(err));
            }).finally(() => {
                setLoading(prev => {
                    prev.send = true;
                    return { send: prev.send, approval1: { ...prev.approval1 }, approval2: { ...prev.approval2 } }
                })
            });
    }

    return (
        <section style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
                <h1 style={{ padding: "1.5rem" }}>Select Department</h1>
                <div >
                    {deptNames.map((deptName, id) =>
                        <div style={{ margin: "0.4rem 0", display: "flex", justifyContent: "flex-start" }} key={id}>
                            <DeptBtn deptName={deptName} status={deptStatus && deptStatus[deptName]} onClick={event => handleDeptBtnClick(event, deptName)} />
                            {/* Approval 1 */}
                            {((isUserExamOfficer(user.designation)) && (user.phase === 2 || user.phase === 3) && deptStatus && deptStatus[deptName] && approval1) ? <Button variant="outlined" sx={{ marginLeft: "1.2rem", width: "9rem", }} endIcon={loading.approval1[deptName] ? <HourglassTop /> : ((approval1[deptName]) ? <TaskAlt /> : <Send />)} disabled={!!(approval1[deptName])} onClick={event => handleApproval1Click(event, deptName)}>
                                {(approval1[deptName]) ? "Approved" : "Approve"}
                            </Button> : ""}
                            {/* Approval 2 */}
                            {((isUserExamController(user.designation)) && (user.phase === 4) && deptStatus && deptStatus[deptName]) ? <Button variant="outlined" sx={{ marginLeft: "1.2rem", width: "9rem", }} endIcon={loading.approval2[deptName] ? <HourglassTop /> : <Send />} onClick={event => handleApproval2Click(event, deptName)}>
                                Approve
                            </Button> : ""}
                        </div>
                    )}
                </div>
            </div>

            {(isUserExamOfficer(user.designation)) && (user.phase === 1) &&
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}>
                    <h1 style={{ padding: "1.5rem" }}>Done Filling Data ?</h1>
                    <Button variant="contained" sx={{ width: "9rem" }} endIcon={loading ? <HourglassTop /> : <Send />} onClick={phaseOneCompletion}>
                        Send
                    </Button>
                </div>
            }
        </section>
    );
}

const DeptSelect = () => {

    const { user } = useContext(userContext);

    const { loading, error, value: deptNames } = useFetch(`${SERVER_LINK}/api/explore/deptNames`, { method: "GET" });
    let { loading: loadingStatus, value: deptStatus } = useFetch(`${SERVER_LINK}/api/explore/allDeptStatus`, { method: "GET" });
    let { loading: loadingApproval1, value: approval1 } = useFetch(`${SERVER_LINK}/api/explore/allApproval1`, { method: "GET" });

    if (user.phase === 1) {
        deptStatus = undefined;
        loadingStatus = false;

        loadingApproval1 = false;
        approval1 = undefined;
    } else {
    }

    return (
        <div>

            {(loading || loadingStatus || loadingApproval1) ? <LoadingSpinner /> :
                (error ? <div>{JSON.stringify(error)}</div> : <DeptSelectComponent user={user} deptNames={deptNames} approval1={approval1} deptStatus={deptStatus} />)
            }
        </div>
    )
}


export default DeptSelect;
