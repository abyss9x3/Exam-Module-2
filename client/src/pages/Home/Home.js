import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { isUserAdmin, isUserExamController, isUserExamOfficer, isUserHOD, isUserMember } from '../../store/user/userUtils'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import NotAvailPage from '../../components/NotAvailPage/NotAvailPage'
import userContext from '../../store/user/userContext'

const Home = () => {

    const { user } = useContext(userContext);

    if (user.isLoading) return <LoadingSpinner />
    else if (!user.loggedIn) return <Navigate to="/login" />

    if (isUserExamOfficer(user.designation)) {
        if ([1, 2, 3].includes(user.phase)) {
            return <Navigate to="/deptSelect" />
        }
        else if (user.phase === 4) {
            return <NotAvailPage msg="You have approved, wait for ExamController Approval to download Excel Sheet" />
        }
        else if (user.phase === 5) {
            return <Navigate to="/excel" />
        }
    }
    else if ((isUserHOD(user.designation) || isUserMember(user.designation))) {
        if (user.phase === 1)
            return <NotAvailPage msg="ExamOfficer has not submitted Table yet !" />
        else if (user.phase === 2)
            return <Navigate to={`/table/${user.deptName}`} />
        else return <NotAvailPage msg="You have submitted examiners !" />
    }
    else if (isUserExamController(user.designation)) {
        if (user.phase === 1 || user.phase === 2) {
            return <NotAvailPage msg="Table is not filled yet!" />
        } else if (user.phase === 3) {
            return <NotAvailPage msg="Table is filled by Dept, waiting for ExamOfficer's Approval !" />
        } else if (user.phase === 4) {
            return <Navigate to="/deptSelect" />
        } else if (user.phase === 5) {
            return <Navigate to="/excel" />
        }
    }
    else if (isUserAdmin(user.designation)) {
        return <Navigate to="/adminDashboard" />
    }
    else return <Navigate to="/login" />
}

export default Home;
