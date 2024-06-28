import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import Index from "./routes/index";
import ErrorPage from "./error-page";
import Login from "./routes/login";
import EditContact, {
  action as editAction,
} from "./routes/edit";
import EditGroup, { action as editGroupAction} from "./routes/edit_group";
import {loader as groupLoder} from "./routes/group";

import Root, { loader as rootLoader, action as rootAction } from "./routes/root";
import Contact, {
  loader as contactLoader,
} from "./routes/contact";

import { action as destroyAction } from "./routes/destroy";



const router = createBrowserRouter([
  {
    path: "/portal",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index /> },
      {
        path: ":groupId/edit_group",
        element: <EditGroup />,
        action: editGroupAction,
        loader: groupLoder,
      },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);