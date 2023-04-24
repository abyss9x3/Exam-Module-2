import { Route, Routes } from "react-router-dom";
import Table from "./components/ExamOffice/Eotable";
import React, { Suspense, useContext, useEffect } from "react";
import userContext from "./store/user/userContext";
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import styles from './App.module.css';
import NavBar from './components/NavBar/NavBar';
import DeptTable from './components/Department/DptTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from "react-router-dom";
import { isUserAdmin, isUserExamController, isUserExamOfficer, isUserHOD, isUserMember } from "./store/user/userUtils";
import NotAvailPage from "./components/NotAvailPage/NotAvailPage";

import HODTable from "./components/HOD/hodphase2";
import EOphase3 from "./components/ExamOffice/Eophase3";
import ECphase4 from "./components/ExamController/ecphase4";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

const Login = React.lazy(() => import('./pages/Login/Login'));
const Signup = React.lazy(() => import('./pages/Signup/Signup'));
const DeptSelect = React.lazy(() => import("./components/DeptSelect/DeptSelect"));

const SplashRoute = ({ user }) => {
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
            return <DeptTable />
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
        return <AdminDashboard />
    }
    else return <Navigate to="/login" />
}

const App = () => {

    /** @type {import("./store/user/userContext").ContextType} */
    const { user, getLoggedIn } = useContext(userContext);

    useEffect(() => {
        // for the first time when website loads
        // check wheather user is loggedIn or not
        getLoggedIn();
    }, [getLoggedIn]);

    return (
        <div className={styles.App}>

            <NavBar />

            <main className={styles.mainContainer}>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" exact element={<SplashRoute user={user} />} />
                        <Route path="/login" exact element={<Login />} />
                        <Route path="/signup" exact element={<Signup />} />
                        <Route path="/deptSelect" exact element={<DeptSelect />} />
                        
                        <Route path="/hodphase2" exact element={<HODTable />} />
                        <Route path="/eophase3" exact element={<EOphase3 />} />
                        <Route path="/ecphase4" exact element={<ECphase4 />} />

                        <Route path="/examoffice/table/:id" exact element={<Table />} />
                        <Route path="/department/table" exact element={<DeptTable />} />
                    </Routes>
                </Suspense>
            </main>
        </div >
    );
}

export default App;
