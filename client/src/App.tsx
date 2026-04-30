import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Root from "./Root";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import "./App.scss";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

/* Step 1 - Get the process id using port number. C:\> netstat -ano | findstr "PID :PortNumber" List of processes using a particular port.
Step 2 - Kill the process using PID. C:\> taskkill /PID pidNumber /F. Terminating a process by PID. */
