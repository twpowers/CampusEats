import React, { useState } from "react";

const LoginPage = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
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
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md text-xl"
                                type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
