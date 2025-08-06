import CreateServerDialog from "@/Components/Dialogs/CreateServer";
import ServerIcon from "../../Components/Icons/Server";
import { useConfig, useUser } from "../../utils/queries";
import { LucideToolCase, Trash } from "lucide-react";
import coinString from "@/utils/coin";
import DeleteServerDialog from "@/Components/Dialogs/DeleteServer";

export default function Servers() {
    const user = useUser();
    const config = useConfig();
    const isOnLimit =
        (user.data?.servers?.length ?? 0) >= (user.data?.user?.serverLimit ?? 0);

    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                    <ServerIcon className="w-8 h-8 text-[#e9a745]" />
                    <h1 className="text-2xl font-bold">Servers</h1>
                </div>

                <CreateServerDialog>
                    <button
                        disabled={isOnLimit}
                        className="bg-[#e9a745] disabled:opacity-50 disabled:hover:bg-[#e9a745] disabled:cursor-not-allowed text-white font-semibold cursor-pointer px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                        Create Server
                    </button>
                </CreateServerDialog>
            </div>

            {!user.data?.servers.length ? (
                <div className="flex flex-col items-center justify-center text-center text-white/80 bg-[#181A20] p-10 rounded-lg shadow-lg">
                    <ServerIcon className="w-16 h-16 mb-6 text-[#e9a745]" />
                    <h2 className="text-xl font-semibold mb-2 text-white">No servers found</h2>
                    <p className="mb-6 text-white/70">
                        You haven't created any servers yet. Get started by creating your first server!
                    </p>
                    <CreateServerDialog>
                        <button
                            disabled={isOnLimit}
                            className="bg-[#e9a745] disabled:opacity-50 disabled:hover:bg-[#e9a745] disabled:cursor-not-allowed cursor-pointer text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors shadow">
                            Create Server
                        </button>
                    </CreateServerDialog>
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-4">
                    {user.data.servers.map((server) => (
                        <div
                            key={server.id}
                            className="relative bg-[#1a1b1f] pt-6 rounded-xl shadow-xl w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col items-center gap-4 border border-[#292a2e] group overflow-hidden hover:shadow-2xl transition-all"
                        >
                            <span
                                className={`absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-[#181A20] ${
                                    server.suspended ? "bg-red-500" : "bg-green-500"
                                }`}
                                title={server.suspended ? "Suspended" : "Active"}
                            />
                            <div className="px-8 w-full flex flex-col items-start">
                                <h3 className="text-lg font-bold text-white mb-1 truncate w-full text-start">
                                    {server.name}
                                </h3>
                                <span className="text-xs text-white/50 mb-2">
                                    #{server.id}
                                </span>
                            </div>
                            <hr className="h-1 mb-2 w-full border-[#35363a]" />

                            <div className="flex flex-col w-full px-8 items-center gap-2">
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Status:</div>
                                    <div>
                                        {server.suspended ? (
                                            <span className="text-red-400 font-semibold">Suspended</span>
                                        ) : (
                                            <span className="text-green-400 font-semibold">Active</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Location:</div>
                                    <div className="truncate max-w-[8rem] text-right">
                                        {config.data?.nodes.find(
                                            (node) => node.id === server.locationId
                                        )?.name || <span className="text-white/30">Unknown</span>}
                                    </div>
                                </div>
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Software:</div>
                                    <div className="truncate max-w-[8rem] text-right">
                                        {server?.nest?.name}
                                    </div>
                                </div>
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Specification:</div>
                                    <div className="truncate max-w-[8rem] text-right">
                                        {config.data?.eggs.find(
                                            (egg) => egg.id === server.eggId
                                        )?.name}
                                    </div>
                                </div>
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Product:</div>
                                    <div className="truncate max-w-[8rem] text-right">
                                        {server?.product?.name}
                                    </div>
                                </div>
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Price:</div>
                                    <div>
                                        {coinString(server?.product?.price || 0)} <code>/ hourly</code>
                                    </div>
                                </div>
                                <div className="flex w-full justify-between text-sm">
                                    <div className="text-white/70">Next Billing:</div>
                                    <div>
                                        {server.nextBilling
                                            ? new Date(server.nextBilling).toLocaleString()
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full gap-2 justify-center bg-[#232428] py-4 flex rounded-b-xl px-4 border-t border-[#292a2e] mt-4">
                                <button
                                    className="bg-[#e9a745] cursor-pointer text-black font-semibold px-3 py-3 rounded-lg hover:bg-yellow-500 transition-all flex items-center justify-center shadow group-hover:shadow-lg"
                                    onClick={() => window.open(import.meta.env.VITE_PTERODACTYL_URL + `/server/${server.identifier}`, "_blank")}
                                >
                                    <LucideToolCase className="w-4 h-4" />
                                </button>
                                <DeleteServerDialog server={server}>
                                    <button
                                        className="bg-red-500 cursor-pointer text-black font-semibold px-3 py-3 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center shadow group-hover:shadow-lg"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </DeleteServerDialog>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}