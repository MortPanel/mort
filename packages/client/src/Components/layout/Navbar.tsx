import coinString from "../../utils/coin";
import { useConfig, useUser } from "../../utils/queries";
import UserAvatar from "../Avatar/User";
import Coin from "../Icons/Coin";
export default function Navbar() {
    const user = useUser();
    const c = useConfig();
    return (
        <div className="flex md:flex-wrap h-auto min-w-full items-center justify-between px-5 py-4 bg-[#181A20]">
            <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
                <img
                    src="/logo/logo.png"
                    className="h-12"
                />

                <p className="text-white/80 text-xl font-bold ml-4">
                    {import.meta.env.VITE_APP_NAME}
                </p>
            </div>
            {(c.data?.usefulLinks)?.filter((link) => link.positions.includes("topbar"))?.length && (
            <div className="md:flex items-center gap-4 hidden">
                {(c.data?.usefulLinks)?.filter((link) => link.positions.includes("topbar"))?.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        {link.title}
                    </a>
                ))}
            </div>
            )}

            <div className="flex flex-row gap-3 w-full md:w-auto items-center justify-end">
                <div className="flex items-center gap-2">
                    <span className="text-white/80">
                        {coinString(user.data?.user.credits || 0)}
                    </span>
                    <Coin className="w-4 h-4 text-white/80" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/80">
                        {user.data?.user.name}
                    </span>
                    <UserAvatar email={user.data?.user.email} className="w-8 h-8 rounded-full sm:mr-4" />
                </div>
            </div>
        </div>
    );
}