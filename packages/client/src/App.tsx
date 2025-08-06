import { Navigate, Route, Routes } from "react-router-dom"
import { isAuthenticated } from "./utils/user"
import './index.css'
import { useConfig, useUser } from "./utils/queries";
import Loading from "./Pages/Loading";
import SetupNotDone from "./Pages/Setup/Incomplete";
import SetupRootUser from "./Pages/Setup/RootUser";
import Login from "./Pages/Account/Login";
import Navbar from "./Components/layout/Navbar";
import Sidebar from "./Components/layout/Sidebar";
import Dashboard from "./Pages/App/Dashboard";
import Servers from "./Pages/App/Servers";
import Products from "./Pages/App/Admin/Product";
import UsefulLinks from "./Pages/App/Admin/UsefulLinks";
import Register from "./Pages/Account/Register";
function App() {
  const config = useConfig();
  useUser();

  if (config.isLoading) return <Loading />
  if (!config.data?.isSetupDone) return <SetupNotDone />
  if (!config.data?.rootUserExists) return <SetupRootUser />
  return (
    <Routes>
      {CreateRouter({
        path: "/",
        authRequired: true,
        element: <Dashboard/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/register",
        authRequired: false,
        element: <Register />,
        addLayout: false
      })}
      {CreateRouter({
        path: "/servers",
        authRequired: true,
        element: <Servers/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/admin/products",
        authRequired: true,
        element: <Products/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/admin/useful-links",
        authRequired: true,
        element: <UsefulLinks/>,
        addLayout: true
      })}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function CreateRouter({
  path,
  authRequired,
  element,
  addLayout = false
}: {
  path: string;
  authRequired: boolean;
  element: React.ReactNode;
  addLayout?: boolean;
}) {
  if (authRequired && !isAuthenticated()) {
    return <Route path={path} element={<Login />} />;
  }
  if (addLayout) {
    return (
      <Route path={path} element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 border-t-2 overflow-y-auto border-l-2 border-[#282b33] bg-[#121317] rounded-lg">
              {element}
            </div>
          </div>
        </div>
      } />
    );
  }
  return <Route path={path} element={element} />;
}

export default App