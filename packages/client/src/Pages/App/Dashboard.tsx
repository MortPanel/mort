import Coin from "@/Components/Icons/Coin";
import HomeIcon from "../../Components/Icons/Home";
import ServerIcon from "../../Components/Icons/Server";
import { useConfig, useUser } from "../../utils/queries";
import coinString from "@/utils/coin";
import { Link } from "lucide-react";

export default function Dashboard() {
    const user = useUser();
    const c = useConfig();
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4">
                <HomeIcon className="w-8 h-8 text-[#e9a745]" />
            <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#23262F] flex items-center gap-4 p-6 rounded-lg min-w-[220px]">
                    <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center">
                        <ServerIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-400">Servers</div>
                        <div className="text-xl font-bold">{user?.data?.servers?.length}</div>
                    </div>
                </div>
                <div className="bg-[#23262F] flex items-center gap-4 p-6 rounded-lg min-w-[220px]">
                    <div className="bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center">
                        <Coin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-400">Credits</div>
                        <div className="text-xl font-bold">{coinString(user?.data?.user?.credits ?? 0)}</div>
                    </div>
                </div>
            </div>

            {(c?.data?.usefulLinks)?.filter((link) => link.positions.includes("dashboard"))?.length ? (
                <div className="mt-8 max-w-2xl">
                    <div className="bg-[#23262F] p-6 rounded-lg">
                        <div className="flex items-center mb-6">
                            <Link className="w-6 h-6 text-gray-300 mr-2" />
                            <h2 className="text-lg font-semibold">Useful Links</h2>
                        </div>
                        <div className="space-y-6">
                            {c.data.usefulLinks.filter((link) => link.positions.includes("dashboard")).map((link) => (
                                <div key={link.id} className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">{link.title}</span>
                                        </div>
                                        <div className="text-gray-300">{link.description}</div>
                                    </div>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-auto text-gray-400 hover:text-blue-400 transition-colors"
                                        title="Open link"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6h12v12" />
                                        </svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ): null}
        </div>
    );
}