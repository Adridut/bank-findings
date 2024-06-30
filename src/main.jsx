import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import Index from "./routes/index";
import ErrorPage from "./error-page";
import Login, {action as loginAction} from "./routes/login";
import EditContact, {
  action as editAction,
} from "./routes/edit";
import EditGroup, { action as editGroupAction} from "./routes/edit_group";
import CreateFinding, {action as createFindingAction} from "./routes/creation-finding";
import GroupCreation, {action as createGroupAction} from "./routes/creation-group";
import {loader as groupLoder} from "./routes/group";

import Root, { loader as rootLoader, action as rootAction } from "./routes/root";
import Contact, {
  loader as contactLoader,
} from "./routes/contact";

import { action as destroyAction } from "./routes/destroy";
import ProtectedRoutes from "./routes/protected-routes";



const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/portal",
        element: <Root />,
        loader: rootLoader,
        action: rootAction,
        children: [
          { index: true, 
            element: <Index /> 
          },
          {
            path: "create_group",
            element: <GroupCreation />,
            action: createGroupAction,
          },
          {
            path: ":groupId/edit_group",
            element: <EditGroup />,
            action: editGroupAction,
            loader: groupLoder,
          },
          {
            path: ":groupId/create_finding",
            element: <CreateFinding />,
            action: createFindingAction,
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
    ]
  },
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
    action: loginAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);