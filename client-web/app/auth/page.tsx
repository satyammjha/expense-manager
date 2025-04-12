import { redirect } from "next/navigation";


export default function AuthPage() {
    redirect("/auth/login");
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black p-4">
            <div>Welcome to the Auth section!</div>;
        </div>
    );
}