"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipLoader } from "react-spinners";
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

export default function Register() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showEncryptionPassword, setShowEncryptionPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(`${apiURL}/register`, {
          username: username,
          email: email,
          master_password: masterPassword,
          encryption_password: encryptionPassword,
        })
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            toast({
              title: "Account Created Successfully!",
              description: "Log in to continue",
            });
          }
          setLoading(false);
        });
    } catch (e: any) {
      console.log(e);
      if (e.response.status == 400) {
        toast({
          variant: "destructive",
          title: "Account already exists!",
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white">
      <Navbar />
      <div className="flex grow items-center justify-center bg-gray-100 dark:bg-black">
        <Toaster />
        <Card className="w-full max-w-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Register for Cypher
            </CardTitle>
            <CardDescription className="text-center">
              Create your secure password manager account
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email goes here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterPassword">Master Password</Label>
                <div className="relative">
                  <Input
                    id="masterPassword"
                    type={showMasterPassword ? "text" : "password"}
                    placeholder="Don't forget this one!"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    required
                    className="pr-10 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMasterPassword(!showMasterPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showMasterPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="encryptionPassword">Encryption Password</Label>
                <div className="relative">
                  <Input
                    id="encryptionPassword"
                    type={showEncryptionPassword ? "text" : "password"}
                    placeholder="Another one for extra safety!"
                    value={encryptionPassword}
                    onChange={(e) => setEncryptionPassword(e.target.value)}
                    required
                    className="pr-10 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowEncryptionPassword(!showEncryptionPassword)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showEncryptionPassword ? (
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
                {loading ? (
                  <ClipLoader size="12" color="#ffffff" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-black dark:text-white font-extrabold hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
