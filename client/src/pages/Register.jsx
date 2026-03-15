import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import ThreeBackground from "../components/ThreeBackground";

function Register() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "student",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await API.post("/auth/register", {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role,
			});

			const token = response?.data?.token;
			const user = response?.data?.user;
			if (!token) {
				throw new Error("Token not found in response");
			}

			localStorage.setItem("token", token);
			if (user) {
				localStorage.setItem("user", JSON.stringify(user));
			}
			navigate("/dashboard");
		} catch (err) {
			setError(err?.response?.data?.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1117] px-4 py-8">
			{/* Three.js animated particle-network backdrop */}
			<ThreeBackground />

			{/* Register card — glass effect on top of the canvas */}
			<div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Digital Notice Board</p>
				<h1 className="mt-2 text-3xl font-semibold text-white">Register</h1>
				<p className="mt-2 text-sm text-slate-400">Create an account to access your dashboard.</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-300">
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
							placeholder="Your full name"
						/>
					</div>

					<div>
						<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
							placeholder="Create a password"
						/>
					</div>

					<div>
						<label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-300">
							Role
						</label>
						<select
							id="role"
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
						>
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
						</select>
					</div>

					{error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loading ? "Creating account..." : "Register"}
					</button>
				</form>

				<p className="mt-5 text-center text-sm text-slate-400">
					Already have an account?{" "}
					<Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
