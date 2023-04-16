import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import { AuthContextProvider } from "./components/context/AuthContext";

function App() {
  const user = localStorage.getItem("token");

  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
