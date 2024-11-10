"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Plus, Trash, Dices } from "lucide-react";
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "../components/Navbar";
import { apiURL } from "../components/links";
import Passwords from "./Passwords";
import { StringSkeleton } from "../components/Skeletons";
import { PageTransition } from "../components/page-transition";
import { useRouter } from "next/navigation";
const { convertFromAES } = require("@harshiyer/json-crypto");
import { LogOut } from "lucide-react";
export default function Dashboard() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [vault, setVault] = useState("");
  const [loading, setLoading] = useState(false);
  const [salt, setSalt] = useState("wow");
  const [showVault, setShowVault] = useState(false);

  const { toast } = useToast();
  useEffect(() => {
    setLoading(true);
    var token: any;
    try {
      token = getCookie("token");
      if (token == null) {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiURL}/getVault`, {
          token: token,
        });
        console.log(response);
        setLoading(false);
        setSalt(response.data.salt);
        setVault(response.data.aesString);
        setUsername(response.data.username);
      } catch (e: any) {
        console.log(e);
        if (e.response?.status == 400) {
          // Handle 400 error
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleLogout = async () => {
    try {
      deleteCookie("token");
      localStorage.removeItem("master_password");
      toast({
        title: "Logged out successfully!",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "An error occurred while logging out!",
        variant: "destructive",
      });
    }

    router.push("/login");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Navbar />
        <Toaster />
        <main className="container mx-auto px-6 py-12">
          <div className="flex flex-row justify-between">
            <h2 className="text-4xl flex flex-row font-bold mb-8">
              Welcome back,
              {username == "" ? <StringSkeleton /> : ""} {username}!
            </h2>
            <Button onClick={handleLogout} type="button" className="ml-2">
              Log Out
              <LogOut />
            </Button>
          </div>
          <section className="mb-12">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Encrypted Vault</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVault(!showVault)}
                    className="text-black dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    {showVault ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="ml-2">{showVault ? "Hide" : "Show"}</span>
                  </Button>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  This is your 256-bit AES encrypted vault string, which is
                  stored in this exact form on our backend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-black dark:text-white">
                  {showVault ? vault : "************************"}
                </pre>
              </CardContent>
            </Card>
          </section>
          <section>
            <Passwords aesString={vault} salt={salt} />
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
