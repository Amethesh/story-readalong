import "regenerator-runtime/runtime";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import StoryElement from "./components/StoryElement.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StoryElement />
  },
  {
    path: "/story/:storyId",
    element: <StoryElement />
  }
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
