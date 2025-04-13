import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import LoginPage from "./auth/login/page";
import SignupPage from "./auth/signup/page";

export default function HomePage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-gray-900 dark:shadow-gray-950 transition-all duration-300 hover:shadow-2xl">
                <div className="space-y-2 text-center">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:from-green-400 dark:to-blue-300">
                        Expense Tracker Pro
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Take control of your finances in one place
                    </p>
                </div>

                <Tabs defaultValue="login" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
                        <TabsTrigger
                            value="login"
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-md py-2 transition-all duration-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400"
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value="signup"
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-md py-2 transition-all duration-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400"
                        >
                            Sign Up
                        </TabsTrigger>
                    </TabsList>

                    {/* Login Tab Content */}
                    <TabsContent 
                        value="login" 
                        className="radix-state-active:animate-slide-in radix-state-inactive:animate-slide-out space-y-4"
                    >
                        <LoginPage />
                    </TabsContent>

                    {/* Signup Tab Content */}
                    <TabsContent 
                        value="signup" 
                        className="radix-state-active:animate-slide-in radix-state-inactive:animate-slide-out space-y-4"
                    >
                        <SignupPage />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}