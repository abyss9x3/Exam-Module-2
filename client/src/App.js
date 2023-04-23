import { Route, Routes } from "react-router-dom";
import Table from "./components/ExamOffice/Eotable";
import React, { Suspense, useContext, useEffect } from "react";
import userContext from "./store/user/userContext";
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import styles from './App.module.css';
import NavBar from './components/NavBar/NavBar';
import DeptTable from './components/Department/DptTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from "react-router-dom";
import { isUserAdmin, isUserExamController, isUserExamOfficer, isUserHOD, isUserMember } from "./store/user/userUtils";

const Login = React.lazy(() => import('./pages/Login/Login'));
const Signup = React.lazy(() => import('./pages/Signup/Signup'));
const Home = React.lazy(() => import('./pages/Home/Home'));


const SplashRoute = ({ user }) => {
  if (user.isLoading) return <LoadingSpinner />
  else if (!user.loggedIn) return <Redirect to="/login" />
  else if (isUserExamController) return <></>
  else if (isUserExamOfficer) return <></>
  else if (isUserHOD) return <></>
  else if (isUserMember) return <></>
  else if (isUserAdmin) return <></>
  else return <Redirect to="/login" />
}

function App() {

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

            {/* ---- Dev routes ---- */}
            <Route path="/table" exact element={<Table />} />
            <Route path="/department" exact element={<DeptTable />} />
          </Routes>
        </Suspense>
      </main>
    </div >
  );
}

export default App;
