import { Route, Routes, Navigate } from "react-router-dom";
import Table from "./components/ExamOffice/Eotable";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import { useContext, useEffect } from "react";
import userContext from "./store/user/userContext";

function App() {

    const { getLoggedIn } = useContext(userContext);

    useEffect(() => {
        // for the first time when website loads
        // check wheather user is loggedIn or not
        getLoggedIn();
    }, [getLoggedIn]);

    return (
        <Routes>
            {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
            <Route path="/" exact element={<Table />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
        </Routes>
    );
}

export default App;
