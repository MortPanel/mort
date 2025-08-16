import { getPermissions } from "@/utils/permissions";
import HomeIcon from "../../../Components/Icons/Home";
import { useAdminOverview, useConfig, usePayments, useUser } from "../../../utils/queries";
import ServerIcon from "@/Components/Icons/Server";
import { BirdIcon, LoaderIcon, UserIcon } from "lucide-react";
import { sync } from "@/utils/apiRequests";

export default function AdminDashboard() {
    const user = useUser();
    const c = useConfig();
    const overview = useAdminOverview();
    const payments = usePayments(5);
    const perms = getPermissions(user.data?.user.permissions || 0);
    if (!perms.includes("*")) return null;
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4">
                <HomeIcon className="w-8 h-8 text-[#e9a745]" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="grid grid-cols-6 mb-4 gap-4">
                <button
                onClick={() => window.open("https://github.com/mortpanel/mort")}
                className="bg-[#464646] hover:bg-[#5a5a5a] cursor-pointer text-white font-bold py-2 px-4 rounded transition">
                    GitHub
                </button>
                <button
                onClick={() => window.open("https://hcb.hackclub.com/donations/start/mortpanel")}
                className="bg-[#464646] hover:bg-[#5a5a5a] cursor-pointer text-white font-bold py-2 px-4 rounded transition">
                    Donate to Mort
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#23262F] flex items-center gap-4 p-6 rounded-lg min-w-[220px]">
                    <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-400">Users</div>
                        <div className="text-xl font-bold">{overview?.data?.totalUsers}</div>
                    </div>
                </div>
                <div className="bg-[#23262F] flex items-center gap-4 p-6 rounded-lg min-w-[220px]">
                    <div className="bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center">
                        <ServerIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-400">Servers</div>
                        <div className="text-xl font-bold">{overview?.data?.totalServers}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap">
                <div className="mt-8 w-full 2xl:w-1/3">
                    <div className="bg-[#23262F] p-6 mr-3 rounded-lg">
                        <div className="flex items-center mb-6">
                            <BirdIcon className="w-6 h-6 text-gray-300 mr-2" />
                            <h2 className="text-lg font-semibold">Pterodactyl</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-700">Resources</th>
                                    <th className="py-2 px-4 border-b border-gray-700">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-700">Eggs</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{c?.data?.eggs?.length}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-700">Nests</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{c?.data?.nests?.length}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-700">Nodes</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{c?.data?.nodes?.length}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-700">Locations</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{overview?.data?.totalLocations}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex items-center justify-end">
                            <button
                                onClick={async () => {
                                    const r = await sync();
                                    if (r.status === 204) window.location.reload();
                                }}
                                className="px-4 mt-2 py-2 flex items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e9a745] bg-[#e9a745] text-white font-semibold hover:bg-[#ffb84d] transition cursor-pointer"
                            >
                                <LoaderIcon className="w-4 h-4 mr-2" />
                                Sync
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 2xl:w-2/3 w-full">
                    <div className="bg-[#23262F] p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
                        <table className="w-full text-left">
                            <tbody>
                                {!payments.isLoading && payments.data?.pages?.map((page) =>
                                    page?.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className={`py-2 px-4 border-b flex items-center border-gray-700`}>
                                                <img src={payment.user.avatar} draggable={false} className="w-8 h-8 rounded-full mr-2" />
                                                {payment.user.name}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-700">{payment.price / 100} {payment.currency}</td>
                                            <td className="py-2 px-4 border-b border-gray-700 truncate max-w-44">{payment.productName} (+{payment.quantity} {payment.productType})</td>
                                            <td className="py-2 px-4 border-b border-gray-700">
                                                <div className={`px-2 max-w-min py-1 rounded text-xs ${payment.status === 'completed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-700">{
                                                new Date(payment.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                            }</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}