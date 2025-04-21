import React from "react";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";

function App() {
    return (
        <div className="w-full min-h-screen">
            <NavBar />
            <HomePage />
        </div>
    );
}

export default App;
