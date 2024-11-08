"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { apiURL } from "../components/links";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ClipLoader } from "react-spinners";
import { getCookie, setCookie } from "cookies-next";

export default function Login() {
  const [username, setUsername] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(`${apiURL}/login`, {
          username: username,
          master_password: masterPassword,
        })
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            toast({
              title: "Logged in successfully!",
            });
            setLoading(false);
          }
          setCookie("token", response.data.token);
        });
    } catch (e: any) {
      if (e.response.status == 401) {
        toast({
          variant: "destructive",
          title: "Invalid Username or Password",
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white">
      <Navbar />
      <div className="flex items-center justify-center grow bg-gray-100 dark:bg-black">
        <Toaster />
        <Card className="w-full max-w-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Log in to Cypher
            </CardTitle>
            <CardDescription className="text-center">
              Access your secure password manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterPassword">Master Password</Label>
                <div className="relative">
                  <Input
                    id="masterPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your master password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    required
                    className="pr-10 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-gray-200 text-white dark:text-black"
              >
                {loading ? <ClipLoader size="12" color="#ffffff" /> : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-black dark:text-white font-extrabold hover:underline"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
