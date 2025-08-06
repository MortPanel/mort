import { useState } from "react";
import { Login as LoginReq } from "../../utils/apiRequests";
import { login } from "../../utils/user";
import type { APIError } from "../../Types/APIError";
export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const click = async () => {
        const loginResponse = await LoginReq(form.email, form.password);
        if (loginResponse.status === 200) {
            window.location.href = '/';
            return login(loginResponse.data.data.token);
        }

        setErrors(Object.fromEntries(Object.entries(loginResponse.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1e1f20]">
            <div className="w-full max-w-md bg-[#222324] p-10 flex flex-col rounded-lg justify-center">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Login
                </h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1" htmlFor="email">Email</label>
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                        <input
                            id="email"
                            type="email"
                            autoComplete="off"
                            placeholder="foo@gmail.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1" htmlFor="password">Password</label>
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

                        <input
                            id="password"
                            type="password"
                            placeholder="********"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>
                    <a href="#" className="text-sm text-[#e9a745] hover:underline justify-end flex">Forgot password?</a>
                    <button
                        onClick={click}
                        disabled={!form.email || !form.password}
                        className="w-full mt-2 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e9a745] bg-[#e9a745] text-white font-semibold hover:bg-[#ffb84d] transition cursor-pointer"
                    >
                        Login
                    </button>
                </div>
                <hr className="my-6 border-[#35363a]" />
                <span className="text-sm text-gray-400 items-center flex justify-center gap-1">
                    Don't have an account?
                    <a href="/register" className="text-[#e9a745] hover:underline">Register</a>
                </span>
            </div>
        </div>
    );
}