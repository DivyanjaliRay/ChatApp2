import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home.js";
import Login from "./pages/login/Login.js";
import SignUp from "./pages/signup/Signup.js";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext.js";
import { useEffect } from "react";
import { identifySocket } from "./utils/socket";
import { SocketContextProvider } from "./context/SocketContext";

function AppContent() {
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser && authUser._id) {
      identifySocket(authUser._id);
    }
  }, [authUser]);

  return (
    <div className="p-4 h-screen flex flex-col items-center justify-center">
      <Routes>
        {/* Route for the Home page */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        {/* Route for the Login page */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        {/* Route for the SignUp page */}
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
      </Routes>
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <SocketContextProvider>
        <AppContent />
      </SocketContextProvider>
    </Router>
  );
}

export default App;


//video
// import { Navigate, Route, Routes } from "react-router-dom";
// import "./App.css";
// import Home from "./pages/home/Home";
// import Login from "./pages/login/Login";
// import SignUp from "./pages/signup/Signup.js";
// import { Toaster } from "react-hot-toast";
// import { useAuthContext } from "./context/AuthContext";

// function App() {
// 	const { authUser } = useAuthContext();
// 	return (
// 		<div className='p-4 h-screen flex items-center justify-center'>
// 			<Routes>
// 				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
// 				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
// 				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
// 			</Routes>
// 			<Toaster />
// 		</div>
// 	);
// }

// export default App;