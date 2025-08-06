import { getPermissions } from "@/utils/permissions";
import HomeIcon from "../../../Components/Icons/Home";
import { useAdminOverview, useConfig, useUser } from "../../../utils/queries";
import ServerIcon from "@/Components/Icons/Server";
import { BirdIcon, LoaderIcon, UserIcon } from "lucide-react";
import { sync } from "@/utils/apiRequests";

export default function AdminDashboard() {
    const user = useUser();
    const c = useConfig();
    const overview = useAdminOverview();
    const perms = getPermissions(user.data?.user.permissions || 0);
    if (!perms.includes("*")) return null;
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4">
                <HomeIcon className="w-8 h-8 text-[#e9a745]" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

            <div className="mt-8 w-1/2">
                <div className="bg-[#23262F] p-6 rounded-lg">
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
                            onClick={async() => {
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


        </div>
    );
}