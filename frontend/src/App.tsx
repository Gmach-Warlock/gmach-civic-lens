import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import "./App.css";
import Root from "./Root";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<Root />}></Route>),
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
