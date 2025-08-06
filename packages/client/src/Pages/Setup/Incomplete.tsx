export default function SetupIncomplete() {
    return (
        <div className="flex flex-col items-center justify-center p-4 h-screen">
            <div className="bg-[#1e1f20] p-6 rounded-lg shadow-lg mb-6 items-center justify-center flex flex-col">
                <svg className="w-24 h-24 mb-6 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-2xl text-white mb-4 font-bold">Setup Incomplete</h1>
                <p className="text-gray-400 mb-8 text-center">
                    The setup has not been completed. <br />
                    Please ensure all required environment variables are configured in backend <code className="bg-[#37415150]">.env</code> file.<br />
                    After updating, restart the backend server to continue.
                </p>
            </div>
        </div>
    );
}