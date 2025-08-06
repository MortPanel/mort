import { useState } from "react";
import { CreateUser } from "../../utils/apiRequests";
import { login } from "../../utils/user";
import type { APIError } from "../../Types/APIError";
import { useUser } from "@/utils/queries";
import { Navigate } from "react-router-dom";
export default function Register() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: ""
    });
    const user = useUser();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const click = async () => {
        const loginResponse = await CreateUser(form.email, form.username, form.password);
        if (loginResponse.status === 201) {
            window.location.href = '/';
            return login(loginResponse.data.data.token);
        }

        setErrors(Object.fromEntries(Object.entries(loginResponse.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }
    if(user.data?.user) return <Navigate to="/" replace={true} />;
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1e1f20]">
            <div className="w-full max-w-md bg-[#222324] p-10 flex flex-col rounded-lg justify-center">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Register
                </h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1" htmlFor="email">Username</label>
                        {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                        <input
                            id="username"
                            type="text"
                            autoComplete="off"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>
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
                    <button
                        onClick={click}
                        disabled={!form.email || !form.password || !form.username}
                        className="w-full mt-2 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e9a745] bg-[#e9a745] text-white font-semibold hover:bg-[#ffb84d] transition cursor-pointer"
                    >
                        Register
                    </button>
                </div>
                <hr className="my-6 border-[#35363a]" />
                <span className="text-sm text-gray-400 items-center flex justify-center gap-1">
                    Already have an account?
                    <a href="/" className="text-[#e9a745] hover:underline">Login</a>
                </span>
            </div>
        </div>
    );
}