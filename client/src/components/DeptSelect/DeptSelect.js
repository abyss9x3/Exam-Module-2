import React from 'react'
import { SERVER_LINK } from './../../dev-server-link';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const DeptBtn = ({ deptName }) => {
    return (
        <button style={{ padding: '5px 0', width: '10rem', margin: '0.2rem 0' }}>
            {deptName}
        </button>
    );
}

const DeptSelectComponent = ({ value }) => {

    const navigator = useNavigate();

    const handleClieck = deptName => {
        navigator(`/examoffice/table/${deptName}`);
    }

    return (
        <section>
            {value.map((deptName, id) =>
                <div onClick={() => handleClieck(deptName)} key={id}>
                    <DeptBtn deptName={deptName} />
                </div>
            )}
        </section>
    );
}

const DeptSelect = () => {

    const { loading, error, value } = useFetch(`${SERVER_LINK}/api/explore/deptNames`, { method: "GET" });

    return (
        <>
            <h1 style={{ padding: "1.5rem" }}>Select Department</h1>
            {loading ? <LoadingSpinner /> :
                (error ? <div>{error}</div> : <DeptSelectComponent value={value} />)
            }
        </>
    )
}


export default DeptSelect;
