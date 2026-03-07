import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"


function Login() {

  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      body: params
    });

    const data = await response.json();
    setMessage(data.message);

    if (data.message === "Login successful") {
      navigate("/dashboard", { state: { email } });
    }
  };

  const handleRegister = async () => {

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      body: params
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (

  <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-200 overflow-hidden">

    {/* NAVBAR */}
    <div className="flex justify-between items-center px-14 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-md">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-indigo-600 font-bold text-2xl">
          B
        </div>
        <h1 className="text-4xl font-bold tracking-wide">
          Budget App
        </h1>
      </div>

      <div className="flex gap-4">

        <a
          href="https://github.com/JB-Rafael/budgeting-app"
          className="px-5 py-2 bg-white/90 text-indigo-700 rounded-full text-xl font-medium hover:bg-white hover:scale-105 transition"
        >
          About
        </a>

        <a
          href="#"
          className="px-5 py-2 bg-white/90 text-indigo-700 rounded-full text-xl font-medium hover:bg-white hover:scale-105 transition"
        >
          Contact
        </a>

        <a
          href="https://github.com/JB-Rafael"
          className="px-5 py-2 bg-white/90 text-indigo-700 rounded-full text-xl font-medium hover:bg-white hover:scale-105 transition"
        >
          GitHub
        </a>

        <a
          href="#"
          className="px-5 py-2 bg-white/90 text-indigo-700 rounded-full text-xl font-medium hover:bg-white hover:scale-105 transition"
        >
          Help
        </a>

      </div>

    </div>


    {/* LOGIN AREA */}
    <div className="flex items-center justify-center py-24 relative">


      {/* glow background */}
      <div className="absolute w-[700px] h-[700px] bg-purple-400 rounded-full blur-[150px] opacity-40 animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-blue-400 rounded-full blur-[130px] opacity-40 left-1/3 top-1/3"></div>


      <Card className="w-[640px] shadow-2xl border border-white/40 backdrop-blur-md bg-white/95 relative">

        <CardHeader className="text-center space-y-4 pb-8 pt-10">

          <CardTitle className="text-5xl font-bold">
            Budget App
          </CardTitle>

          <p className="text-xl text-gray-500">
            Manage your finances simply
          </p>

        </CardHeader>


        <CardContent className="space-y-8 px-12 pb-10">

          <div className="space-y-2">
            <Label className="text-2xl">Email address</Label>
            <Input
              className="!h-16 !text-xl px-4"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-2xl">Password</Label>
            <Input
              className="!h-16 !text-xl px-4"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full h-16 text-2xl" onClick={handleLogin}>
            Log in
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 text-2xl"
            onClick={handleRegister}
          >
            Register
          </Button>

          {message && (
            <p className="text-base text-center text-red-500">
              {message}
            </p>
          )}

        </CardContent>

      </Card>

    </div>

  </div>

);

}

export default Login;