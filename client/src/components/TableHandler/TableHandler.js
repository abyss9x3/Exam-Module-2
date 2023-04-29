import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import TableContainer from '../TableContainer/TableContainer';
import userContext from './../../store/user/userContext';
import { isUserExamController, isUserExamOfficer, isUserMember, isUserHOD } from './../../store/user/userUtils';
import useFetch from './../../hooks/useFetch';
import NotAvailPage from './../NotAvailPage/NotAvailPage';
import { SERVER_LINK } from './../../dev-server-link';

const TableHandler = () => {

    const params = useParams();
    const deptName = params.deptName;
    const { user } = useContext(userContext);

    if (!deptName) {
        return <NotAvailPage msg="No department name passed !" />
    }
    // 1. EO in phase 1
    else if (isUserExamOfficer(user.designation) && user.phase === 1) {
        return <Table1 deptName={deptName} />
    }
    // 2. M in phase 2
    else if (isUserMember(user.designation) && user.phase === 2) {
        // check user.deptName with deptName
        return <Table2 deptName={deptName} />
    }
    // 3. HOD in phase 2
    else if (isUserHOD(user.designation) && user.phase === 2) {
        // check user.deptName with deptName
        return <Table3 deptName={deptName} />
    }
    // 4. EO in phase 3
    else if (isUserExamOfficer(user.designation) && (user.phase === 2 || user.phase === 3)) {
        return <Table4 deptName={deptName} />
    }
    // 5. EC in phase 4
    else if (isUserExamController(user.designation) && (user.phase === 3 && user.phase === 4)) {
        return <Table5 deptName={deptName} />
    }
    else {
        return <NotAvailPage msg="You are not Authorized to view this page !" />
    }
}

const Table1 = ({ deptName }) => {

    const {
        value: rows, setValue: setRows, error, setError, loading
    } = useFetch(`${SERVER_LINK}/api/explore/deptTableWithoutExaminers?deptName=${deptName}`, { method: "GET" });

    return (
        <TableContainer
            show={[
                "T",
                "deleteBtn", "addBtn", "commitBtn"
            ]}
            editable={[
                'SC', 'SN', 'T'
            ]}
            deptName={deptName}
            rows={rows}
            setRows={setRows}
            loading={loading}
            error={error}
            setError={setError}
            commitUrl={`${SERVER_LINK}/api/explore/deptTableWithoutExaminers?deptName=${deptName}`}
        />
    );
}

const Table2 = ({ deptName }) => {

    const {
        value: rows, setValue: setRows, error, setError, loading
    } = useFetch(`${SERVER_LINK}/api/explore/departmentTable?deptName=${deptName}`, { method: "GET" });

    return (
        <TableContainer
            show={[
                "T", "SYLL", "E1", "E2", "rowCommit"
            ]}
            editable={[
                'SYLL', 'E1', 'E2'
            ]}
            deptName={deptName}
            rows={rows}
            setRows={setRows}
            loading={loading}
            error={error}
            setError={setError}
            commitUrl={`${SERVER_LINK}/api/explore/departmentTable?deptName=${deptName}`}
        />
    );
}

const Table3 = ({ deptName }) => {

    const {
        value: rows, setValue: setRows, error, setError, loading
    } = useFetch(`${SERVER_LINK}/api/explore/departmentTable?deptName=${deptName}`, { method: "GET" });

    return (
        <TableContainer
            show={[
                "T", "SYLL", "E1", "E2", "rowCommit",
                "commitBtn", "sendBtn"
            ]}
            editable={[
                'SYLL', 'E1', 'E2'
            ]}
            deptName={deptName}
            rows={rows}
            setRows={setRows}
            loading={loading}
            error={error}
            setError={setError}
            commitUrl={`${SERVER_LINK}/api/explore/departmentTable?deptName=${deptName}`}
        />
    );
}

const Table4 = ({ deptName }) => {

    const {
        value: rows, setValue: setRows, error, setError, loading
    } = useFetch(`${SERVER_LINK}/api/explore/departmentTableWithoutCommits?deptName=${deptName}`, { method: "GET" });

    return (
        <TableContainer
            show={[
                "T", "SYLL", "E1", "E2",
                "commitBtn"
            ]}
            editable={[
                'SC', 'SN', 'T', 'SYLL', 'E1', 'E2'
            ]}
            deptName={deptName}
            rows={rows}
            setRows={setRows}
            loading={loading}
            error={error}
            setError={setError}
            commitUrl={`${SERVER_LINK}/api/explore/departmentTable?deptName=${deptName}`}
        />
    );
}

const Table5 = ({ deptName }) => {

    const {
        value: rows, setValue: setRows, error, setError, loading
    } = useFetch(`${SERVER_LINK}/api/explore/departmentTableWithoutCommits?deptName=${deptName}`, { method: "GET" });

    return (
        <TableContainer
            show={[
                "T", "SYLL", "E1", "E2",
                "commitBtn"
            ]}
            editable={[
                'SC', 'SN', 'T', 'SYLL', 'E1', 'E2'
            ]}
            deptName={deptName}
            rows={rows}
            setRows={setRows}
            loading={loading}
            error={error}
            setError={setError}
            commitUrl={`${SERVER_LINK}/api/explore/departmentTable?deptName=${deptName}`}
        />
    );
}

/*
Tables :
1. EO in phase 1 - CommitBtn, AddRowBtn - (ID, SN*, SC*, T*)
2. M in phase 2 - (ID, SN, SC, T, SYLL*, E1N*, E1E*, E1CN*, E2N*, E2E*, E2CN*, RowCommitBtn*)
3. HOD in phase 2 - Commit Btn, Send Btn - (ID, SN, SC, T, SYLL*, E1N*, E1E*, E1CN*, E2N*, E2E*, E2CN*, RowCommitBtn*)
4. EO in phase 3 - CommitBtn - (ID, SN*, SC*, T*, SYLL*, E1N*, E1E*, E1CN*, E2N*, E2E*, E2CN*)
5. EC in phase 4 - CommitBtn - (ID, SN*, SC*, T*, SYLL*, E1N*, E1E*, E1CN*, E2N*, E2E*, E2CN*)
*/

export default TableHandler;
