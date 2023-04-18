import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Table from "./components/ExamOffice/Eotable";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
        <Route path="/" exact element={<Table />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
