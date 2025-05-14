import React from 'react';
export default function AboutPage() {
    return (
        <div className="w-full bg-white">
            <div className="bg-gray-100 w-full py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl text-center font-bold mb-2">About Campus Eats</h1>
                    <p className="text-center text-gray-600">Learn about our team and mission</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Tanish Visanagiri</h3>
                            <p className="text-gray-700 mb-4">
                                Specializing in modern web technologies and user-centric design.
                                Passionate about helping people discover new dining experiences.
                            </p>
                            <div className="flex justify-between items-center">
                                <a
                                    href="mailto:tanishv@iastate.edu"
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition-colors"
                                >
                                    Contact
                                </a>
                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Co-Founder</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Troy Powers</h3>
                            <p className="text-gray-700 mb-4">
                                Skilled in UX design and front-end development.
                                Ensures everything looks great and runs smoothly.
                            </p>
                            <div className="flex justify-between items-center">
                                <a
                                    href="mailto:twpowers@iastate.edu"
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition-colors"
                                >
                                    Contact
                                </a>
                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Co-Founder</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                    <p className="text-gray-700">
                        Campus Eats was created for our COM S 319 Introduction to User Interfaces class to find and support local businesses
                        and help discover the best restaurants. Our team uses the best web development techniques to ensure you have access
                        to up-to-date restaurant information.
                    </p>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        Have questions or suggestions? We'd love to hear from you! Reach out at{' '}
                        <a href="mailto:tanishv@iastate.edu" className="text-blue-500 hover:underline">
                            tanishv@iastate.edu
                        </a>{' '}
                        and{' '}
                        <a href="mailto:twpowers@iastate.edu" className="text-blue-500 hover:underline">
                            twpowers@iastate.edu
                        </a>.
                    </p>
                </div>
            </div>

        </div>
    );
}
