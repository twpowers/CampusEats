import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('user', JSON.stringify(data.user))
            setUser(data.user);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-200 rounded-lg p-10 w-full max-w-md">
                    <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <input
                                className="w-full p-3 rounded-md text-center bg-white"
                                type="email"
                                name="email"
                                placeholder="Enter your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <input
                                className="w-full p-3 rounded-md text-center bg-white"
                                type="password"
                                name="password"
                                placeholder="Enter your Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="">
                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md text-xl mb-4"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <p>Not a user? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">Create an Account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;