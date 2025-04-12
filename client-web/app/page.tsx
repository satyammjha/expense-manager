import React from "react";

export default function HomePage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-black">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Our App!</h1>
                <p className="text-lg">Get started by logging in or signing up.</p>
            </div>
        </div>
    );
}