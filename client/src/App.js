import { Route, Routes, Navigate } from "react-router-dom";
import Table from "./components/ExamOffice/Eotable";
import React, { Suspense, useContext, useEffect } from "react";
import userContext from "./store/user/userContext";
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import styles from './App.module.css';
import NavBar from './components/NavBar/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Signup = React.lazy(() => import('./pages/Signup/Signup'));

function App() {

  const { getLoggedIn } = useContext(userContext);

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
            {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
            <Route path="/" exact element={<Table />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
          </Routes>
        </Suspense>
      </main>
    </div >
  );
}

export default App;
