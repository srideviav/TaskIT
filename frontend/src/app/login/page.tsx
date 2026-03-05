import LoginForm from "@/src/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      
      {/* Left Branding */}
      <div className="hidden lg:flex flex-1 bg-blue-600 text-white items-center justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Taskit
          </h1>
          <p className="text-lg opacity-90">
            Manage tasks, collaborate with teams,
            and stay productive.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
}