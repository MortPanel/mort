import { useState } from "react";
import { login } from "../../utils/user";
import type { APIError } from "../../Types/APIError";
import { CreateUser } from "../../utils/apiRequests";


export default function SetupRootUser() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: "",
        pterodactylId: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        let error: string | undefined = undefined;

        if (name === "username" && value) {
            if (value.length < 3 || value.length > 20) error = "Username must be between 3 and 20 characters";
            else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = "Username can only contain letters, numbers, and underscores";
        }
        if (name === "email" && value) if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email must be a valid email address";
        if (name === "password" && value) if (value.length < 6 || value.length > 30) error = "Password must be between 6 and 30 characters";
        if (name === "pterodactylId" && value) if (isNaN(Number(value))) error = "Pterodactyl User ID must be a number";

        if (name === "pterodactylId" && Number(value) <= 0) error = "Pterodactyl User ID must be a positive number";

        setErrors(prev => ({ ...prev, [name]: error ?? "" }));
    };

    const handleSubmit = async () => {
        const register = await CreateUser(form.email, form.username, form.password, true, form.pterodactylId);
        if (register.status === 201) {
            window.location.href = '/';
            return login(register.data.data.token);
        }

        setErrors(Object.fromEntries(Object.entries(register.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 h-screen bg-[#1e1f20]">
            <div className="bg-[#222324] p-6 rounded-lg shadow-lg mb-6 items-center justify-center flex flex-col w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-white">Setup Root User</h2>
                <p className="text-gray-400 mb-4 text-center">
                    Please create a root user account to manage the panel.
                    This account will have full administrative privileges.
                </p>
                <div className="flex flex-col gap-4 w-full">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                    />
                    {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                    <input
                        type="text"
                        name="pterodactylId"
                        placeholder="Pterodactyl User ID"
                        value={form.pterodactylId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                    />
                    {errors.pterodactylId && <span className="text-red-500 text-sm">{errors.pterodactylId}</span>}
                    <button
                        onClick={handleSubmit}
                        disabled={
                            Object.values(errors).some(error => error && error.length > 0) ||
                            !form.email ||
                            !form.password ||
                            !form.username ||
                            !form.pterodactylId ||
                            (Boolean(form.pterodactylId) && isNaN(Number(form.pterodactylId)))
                        }
                        className="w-full mt-2 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e9a745] bg-[#e9a745] text-white font-semibold hover:bg-[#ffb84d] transition cursor-pointer"
                    >
                        Create Root User
                    </button>
                </div>
            </div>
        </div>
    );
}