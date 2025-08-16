import { paymentCheckout } from "@/utils/apiRequests";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function Payment() {

    const { state } = useParams();
    const {
        sId,
        service,
        productId
    } = Object.fromEntries(new URLSearchParams(window.location.search));
    const [apiState, setState] = useState<"success" | "error" | "loading">("loading");
    useEffect(() => {
        if (state == "success" && !isNaN(Number(productId)) && sId && service) {
            async function check() {
                const check = await paymentCheckout(Number(productId), service, sId);
                if (check.status === 200) setState("success");
                else setState("error");
            }
            check();
        }
    }, [state, productId, service, sId]);
    if (state !== "success") return <Navigate to={`/`} />

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-[#222324] rounded-2xl shadow-2xl p-10 flex flex-col items-center min-w-[340px] max-w-sm w-full">
                {apiState === "loading" && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin w-10 h-10 border-4 border-t-[#e9a745] border-gray-700 rounded-full mb-6" />
                        <p className="text-gray-400 text-base font-medium">Processing payment...</p>
                    </div>
                )}
                {apiState === "error" && (
                    <>
                        <X className="h-10 w-10 text-red-500 mb-4" />
                        <div className="text-center">
                            <p className="text-red-400 text-xl font-semibold mb-2">Payment Failed</p>
                            <p className="text-gray-400 mb-6">Something went wrong. Please try again or contact support.</p>
                        </div>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="px-5 py-2 bg-[#e9a745] cursor-pointer text-black rounded-lg hover:bg-[#d8a23c] transition-colors font-semibold"
                        >
                            Go to Home
                        </button>
                    </>
                )}
                {apiState === "success" && (
                    <>
                        <Check className="h-10 w-10 text-green-500 mb-4" />
                        <p className="text-green-400 text-xl font-semibold mb-2">Payment Successful!</p>
                        <div className="mt-2 text-center mb-6">
                            <p className="text-gray-300">Your payment was processed successfully.</p>
                            <p className="text-gray-300">Thank you for your purchase!</p>
                        </div>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="px-5 py-2 bg-[#e9a745] cursor-pointer text-black rounded-lg hover:bg-[#d8a23c] transition-colors font-semibold"
                        >
                            Go to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}