import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SERVER_LINK } from './../../dev-server-link';
import { justFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import userContext from '../../store/user/userContext';
import { isUserExamController, isUserExamOfficer } from '../../store/user/userUtils';
import DeptSelectUI from './DeptSelectUI';

const DeptSelectComponent = ({ deptNames, deptStatus, user, approval1, approval2, fetchApproval2, fetchDeptNames, fetchDeptStatus, fetchApproval1 }) => {

    const navigator = useNavigate();

    const [loading, setLoading] = useState({ send: false, approval1: {}, approval2: {} });

    const handleDeptBtnClick = (event, deptName) => {
        event.preventDefault();
        navigator(`/table/${deptName}`);
    }

    const handleApproval1Click = (event, deptName) => {
        event.preventDefault();

        if (loading.approval1[deptName]) return;
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
                fetchApproval1();
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

        if (loading.approval2[deptName]) return;
        setLoading(prev => {
            prev.approval2[deptName] = true;
            return { send: prev.send, approval1: { ...prev.approval1 }, approval2: { ...prev.approval2 } }
        })
        fetch(`${SERVER_LINK}/api/explore/approval2?deptName=${deptName}`, { method: "PUT", credentials: "include" })
            .then(async res => {
                if (res.ok) return res.json()
                const json = await res.json();
                return await Promise.reject(json);
            })
            .then(res => {
                alert(res);
                fetchApproval2();
            })
            .catch(err => {
                alert(JSON.stringify(err));
            }).finally(() => {
                setLoading(prev => {
                    prev.approval2[deptName] = false;
                    return { send: prev.send, approval1: { ...prev.approval1 }, approval2: { ...prev.approval2 } }
                })
            });
    }

    const phaseOneCompletion = event => {
        event.preventDefault();

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
                window.location.reload();
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

    if (isUserExamOfficer(user.designation) && (user.phase === 1))
        return (
            <DeptSelectUI
                deptNames={deptNames}
                handleDeptBtnClick={handleDeptBtnClick}
                loadingSend={loading.send}
                showSendBtn={isUserExamOfficer(user.designation) && (user.phase === 1)}
                sendBtnText="Done Filling Data ?"
                handleSendBtn={phaseOneCompletion}
            />
        );

    else if (isUserExamOfficer(user.designation) && (user.phase === 2 || user.phase === 3))
        return (
            <DeptSelectUI
                loadingApproval={deptName => loading.approval1[deptName]}
                deptNames={deptNames}
                deptStatus={deptStatus}
                showAppprovalBtns={deptName => (deptStatus && deptStatus[deptName] && approval1)}
                handleApprovalClick={handleApproval1Click}
                handleDeptBtnClick={handleDeptBtnClick}
                approval={approval1}
            />
        );

    else if (isUserExamController(user.designation) && user.phase === 4)
        return (
            <DeptSelectUI
                loadingApproval={deptName => loading.approval2[deptName]}
                deptNames={deptNames}
                deptStatus={deptStatus}
                showAppprovalBtns={deptName => (approval1 && approval1[deptName] && approval2)}
                handleApprovalClick={handleApproval2Click}
                handleDeptBtnClick={handleDeptBtnClick}
                approval={approval2}
            />
        );

    else return <div>You are not Authorized to view this page !</div>
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'deptNames-data': {
            return { ...state, deptNames: action.data };
        }
        case 'deptStatus-data': {
            return { ...state, deptStatus: action.data };
        }
        case 'approval1-data': {
            return { ...state, approval1: action.data };
        }
        case 'approval2-data': {
            return { ...state, approval2: action.data };
        }

        case 'deptNames-loading-false': {
            return { ...state, loading_deptNames: false };
        }
        case 'deptStatus-loading-false': {
            return { ...state, loading_deptStatus: false };
        }
        case 'approval1-loading-false': {
            return { ...state, loading_approval1: false };
        }
        case 'approval2-loading-false': {
            return { ...state, loading_approval2: false };
        }

        case 'deptNames-loading-true': {
            return { ...state, loading_deptNames: true };
        }
        case 'deptStatus-loading-true': {
            return { ...state, loading_deptStatus: true };
        }
        case 'approval1-loading-true': {
            return { ...state, loading_approval1: true };
        }
        case 'approval2-loading-true': {
            return { ...state, loading_approval2: true };
        }

        case 'error': {
            return { ...state, error: action.data };
        }

        default: {
            return { ...state };
        }
    }
}

const initialState = {
    deptNames: undefined,
    deptStatus: undefined,
    approval1: undefined,
    approval2: undefined,

    loading_deptNames: false,
    loading_deptStatus: false,
    loading_approval1: false,
    loading_approval2: false,

    error: undefined
};

const DeptSelect = () => {

    const { user } = useContext(userContext);

    const [state, dispatch] = useReducer(reducer, initialState);


    const fetchDeptNames = () => justFetch(
        `${SERVER_LINK}/api/explore/deptNames`,
        { method: "GET" },
        () => dispatch({ type: "deptNames-loading-true" }),
        data => dispatch({ type: "deptNames-data", data }),
        data => dispatch({ type: "error", data }),
        () => dispatch({ type: "deptNames-loading-false" })
    );
    useEffect(() => {
        return fetchDeptNames();
    }, [user.phase]);


    const fetchDeptStatus = () => justFetch(
        `${SERVER_LINK}/api/explore/allDeptStatus`,
        { method: "GET" },
        () => dispatch({ type: "deptStatus-loading-true" }),
        data => dispatch({ type: "deptStatus-data", data }),
        data => dispatch({ type: "error", data }),
        () => dispatch({ type: "deptStatus-loading-false" })
    );
    useEffect(() => {
        if (!user.phase || user.phase === 4 || user.phase === 1) return;
        return fetchDeptStatus();
    }, [user.phase]);



    const fetchApproval1 = () => justFetch(
        `${SERVER_LINK}/api/explore/allApproval1`,
        { method: "GET" },
        () => dispatch({ type: "approval1-loading-true" }),
        data => dispatch({ type: "approval1-data", data }),
        data => dispatch({ type: "error", data }),
        () => dispatch({ type: "approval1-loading-false" })
    );
    useEffect(() => {
        if (!user.phase || user.phase === 1) return;
        return fetchApproval1();
    }, [user.phase]);


    const fetchApproval2 = () => justFetch(
        `${SERVER_LINK}/api/explore/allApproval2`,
        { method: "GET" },
        () => dispatch({ type: "approval2-loading-true" }),
        data => dispatch({ type: "approval2-data", data }),
        data => dispatch({ type: "error", data }),
        () => dispatch({ type: "approval2-loading-false" })
    );
    useEffect(() => {
        if (!user.phase || user.phase !== 4) return;
        return fetchApproval2();
    }, [user.phase]);


    return (
        <div>
            {(state.loading_deptNames || state.loading_deptStatus || state.loading_approval2 || state.loading_approval2) ? <LoadingSpinner /> :
                (state.error ? <div>{JSON.stringify(state.error)}</div> :
                    <DeptSelectComponent
                        user={user}
                        deptNames={state.deptNames}
                        deptStatus={state.deptStatus}
                        approval1={state.approval1}
                        approval2={state.approval2}
                        fetchDeptNames={fetchDeptNames}
                        fetchDeptStatus={fetchDeptStatus}
                        fetchApproval1={fetchApproval1}
                        fetchApproval2={fetchApproval2}
                    />
                )
            }
        </div>
    )
}


export default DeptSelect;
