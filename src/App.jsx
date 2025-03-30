import "./App.css";

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Benchmark from "./Benchmark";
import ResetPassword from "./ResetPassword";
import Admin from "./Admin";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route 
            exact 
            path="/" 
            element={<Home />}
          />
          <Route 
            path="/Login" 
            element={<Login />}
          />
          <Route 
            path="/ResetPassword" 
            element={<ResetPassword />}
          />
          <Route element={<PrivateRoute />}>
            <Route path="/Benchmark" element={<Benchmark />} />
            <Route path="/Admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>  
    </>
  );
}

export default App;
