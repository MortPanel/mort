import { Navigate, Route, Routes } from "react-router-dom"
import { isAuthenticated, logout } from "./utils/user"
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
import AdminDashboard from "./Pages/App/Admin/Overview";
import Users from "./Pages/App/Admin/Users";
import AdminServers from "./Pages/App/Admin/Servers";
import Tickets from "./Pages/App/Tickets";
import ViewTicket from "./Pages/App/ViewTicket";
import AdminTickets from "./Pages/App/Admin/Tickets";
function App() {
  const config = useConfig();
  const user = useUser();

  if (config.isLoading) return <Loading />
  if (!config.data?.isSetupDone) return <SetupNotDone />
  if (!config.data?.rootUserExists) return <SetupRootUser />

  if(!user.isLoading && !user.isError && !user?.data?.user && isAuthenticated()) logout();

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
        path: "/tickets",
        authRequired: true,
        element: <Tickets/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/tickets/:id",
        authRequired: true,
        element: <ViewTicket/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/admin/tickets",
        authRequired: true,
        element: <AdminTickets/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/admin/overview",
        authRequired: true,
        element: <AdminDashboard/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/admin/users",
        authRequired: true,
        element: <Users/>,
        addLayout: true
      })}
      {CreateRouter({
        path: "/admin/servers",
        authRequired: true,
        element: <AdminServers/>,
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
            <div className="flex-1 max-h-[calc(100vh-5rem)] border-t-2 overflow-y-auto border-l-2 border-[#282b33] bg-[#121317] rounded-lg">
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