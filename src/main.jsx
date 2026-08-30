import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./components/RootLayout.jsx";
import { Error } from "./components/Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <App /> },
      { path: "home", element: <App /> },
      // Catch-all so unknown URLs render the styled 404 instead of falling
      // through to the router's default error screen.
      { path: "*", element: <Error /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
