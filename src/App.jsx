import { Routes, Route, createBrowserRouter, createRoutesFromElements, defer } from "react-router-dom";


import "./index.css";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthLayout } from "./components/AuthLayout";
import { AuthProvider } from "./hooks/useAuth";

import ErrorPage from "./error-page";
import Login from "./routes/login";
import EditContact, {
  action as editAction,
} from "./routes/edit";
import Root, { loader as rootLoader, action as rootAction } from "./routes/root";
import Contact, {
  loader as contactLoader,
} from "./routes/contact";
import { action as destroyAction } from "./routes/destroy";

//https://blog.logrocket.com/authentication-react-router-v6/

const getUserData = () =>
    new Promise((resolve) =>
      setTimeout(() => {
        const user = window.localStorage.getItem("user");
        resolve(user);
      }, 3000)
    );

export const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthLayout/>} loader={() => defer({ userPromise: getUserData() })}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute/>}>
            <Route element={<Root />}>
                <Route path="/contact" element={<Contact />} loader={contactLoader}></Route>
                <Route path="contacts/:contactId/edit" element={<EditContact />} loader={contactLoader} action={editAction}></Route>
                <Route path="contacts/:contactId/destroy" action={destroyAction}></Route>
            </Route>
            </Route>
        </Route>
      </>
    )
  );

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<ProtectedRoute><Root/></ProtectedRoute>} errorElement={<ErrorPage/>} loader={rootLoader} action={rootAction} children={[
//             <Route path="/contact" element={<Contact />} loader={contactLoader}></Route>,
//             <Route path="contacts/:contactId/edit" element={<EditContact />} loader={contactLoader} action={editAction}></Route>,
//             <Route path="contacts/:contactId/destroy" action={destroyAction}></Route>,
//             ]}/>
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;