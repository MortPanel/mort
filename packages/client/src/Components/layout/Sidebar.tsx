import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/queries";
import HomeIcon from "../Icons/Home";
import ServerIcon from "../Icons/Server";
import StoreIcon from "../Icons/Store";
import { getPermissions } from "../../utils/permissions";
import ProductIcon from "../Icons/Product";
import { Link, Ticket, UserIcon } from "lucide-react";

const menuItems = [
    { label: "Dashboard", url: "/", icon: <HomeIcon className="w-6 h-6" /> },
    { label: "Servers", url: "/servers", icon: <ServerIcon className="w-6 h-6" /> },
    { label: "Tickets", url: "/tickets", icon: <Ticket className="w-6 h-6" /> },
    { label: "Store", url: "/store", icon: <StoreIcon className="w-6 h-6" /> },
];

export default function Sidebar() {
    const user = useUser();
    const permissions = getPermissions(user.data?.user.permissions || 0);
    const nav = useNavigate();

    return (
        <div className="hidden md:flex overflow-auto flex-col w-64 gap-2 max-h-[calc(100vh-4rem)] py-2 items-start bg-[#181A20] text-white">
            {menuItems.map((item) => (
                <div
                    key={item.url}
                    onClick={() => nav(item.url)}
                    className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: item.url }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                >
                    {isActive({ url: item.url }) && (
                        <div className="absolute left-0 top-0 h-full w-1 rounded-r-lg bg-[#e9a745]"></div>
                    )}
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex items-center w-full justify-between gap-2">
                            <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {item.label === "Servers" && (
                                <span className="bg-[#23262F] font-bold text-xs px-2 py-1 rounded ml-2" style={{ letterSpacing: '0.20em' }}>
                                    {user?.data?.servers?.length}/{user?.data?.user?.serverLimit}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {permissions.includes("*") && (
                <>
                    <h1 className="text-white/80 text-sm font-semibold px-6 mt-4 mb-2">
                        Admin
                    </h1>
                    <div
                        onClick={() => nav("/admin/overview")}
                        className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: "/admin/overview" }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                    >
                        <HomeIcon className="w-6 h-6" />
                        <div className="flex items-center gap-2">
                            <span>Overview</span>
                        </div>
                    </div>
                    <div
                        onClick={() => nav("/admin/products")}
                        className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: "/admin/products" }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                    >
                        <ProductIcon className="w-6 h-6" />
                        <div className="flex items-center gap-2">
                            <span>Products</span>
                        </div>
                    </div>
                    <div
                        onClick={() => nav("/admin/users")}
                        className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: "/admin/users" }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                    >
                        <UserIcon className="w-6 h-6" />
                        <div className="flex items-center gap-2">
                            <span>Users</span>
                        </div>
                    </div>
                    <div
                        onClick={() => nav("/admin/servers")}
                        className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: "/admin/servers" }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                    >
                        <ServerIcon className="w-6 h-6" />
                        <div className="flex items-center gap-2">
                            <span>Servers</span>
                        </div>
                    </div>
                    <div
                        onClick={() => nav("/admin/tickets")}
                        className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: "/admin/tickets" }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                    >
                        <Ticket className="w-6 h-6" />
                        <div className="flex items-center gap-2">
                            <span>Tickets</span>
                        </div>
                    </div>
                </>
            )}

            {permissions.includes("usefulLinks") && (
                <>
                    <h1 className="text-white/80 text-sm font-semibold px-6 mt-4 mb-2">
                        Other
                    </h1>

                    <div
                        onClick={() => nav("/admin/useful-links")}
                        className={`flex items-center cursor-pointer hover:bg-[#282b33] transform duration-300 gap-3 px-6 py-3 w-full font-semibold relative ${isActive({ url: "/admin/useful-links" }) ? "bg-[#282b33] text-[#e9a745]" : ""}`}
                    >
                        <Link className="w-6 h-6" />
                        <div className="flex items-center gap-2">
                            <span>Useful Links</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function isActive({ url }: { url: string }) {
    return window.location.pathname === url;
}