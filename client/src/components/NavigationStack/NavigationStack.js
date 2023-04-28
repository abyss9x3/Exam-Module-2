import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import HODTable from "../Tables/HOD/hodphase2";
import EOphase3 from "../Tables/ExamOffice/Eophase3";
import ECphase4 from "../Tables/ExamController/ecphase4";
import DeptTable from '../Tables/Department/DptTable';
import Table from "../Tables/ExamOffice/Eotable";

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import NotAvailPage from "../NotAvailPage/NotAvailPage";
import TableContainer from '../TableContainer/TableContainer';
import TableHandler from '../TableHandler/TableHandler';

const Login = React.lazy(() => import('../../pages/Login/Login'));
const Signup = React.lazy(() => import('../../pages/Signup/Signup'));
const DeptSelect = React.lazy(() => import("../../pages/DeptSelect/DeptSelect"));
const Home = React.lazy(() => import('../../pages/Home/Home'));
const AdminDashboard = React.lazy(() => import("../../pages/AdminDashboard/AdminDashboard"));
const ExcelDownloadPage = React.lazy(() => import('../../pages/ExcelDownloadPage/ExcelDownloadPage'));

const NavigationStack = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/signup" exact element={<Signup />} />
                <Route path="/deptSelect" exact element={<DeptSelect />} />
                <Route path="/adminDashboard" exact element={<AdminDashboard />} />
                <Route path="/excel" exact element={<ExcelDownloadPage />} />

                <Route path="/hodphase2" exact element={<HODTable />} />
                <Route path="/eophase3" exact element={<EOphase3 />} />
                <Route path="/ecphase4" exact element={<ECphase4 />} />
                ``
                <Route path="/examoffice/table/:deptName" exact element={<Table />} />
                <Route path="/department/table/:deptName" exact element={<DeptTable />} />

                <Route path="/tableHandler/:id" exact element={<TableHandler />} />

                <Route path="*" element={<NotAvailPage msg="Page Not Found !" />} />
            </Routes>
        </Suspense>
    )
}

export default NavigationStack;
