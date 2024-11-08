"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import axios from "axios";
import { apiURL } from "../components/links";
import { getCookie, setCookie } from "cookies-next";

export default function Dashboard() {
  const [vault, setVault] = useState("");
  const [loading, setLoading] = useState(false);
  //const [token, setToken] = useState("");

  useEffect(() => {
    setLoading(true);
    var token = getCookie("token");
    // Call the backend for the vault
    const fetchData = async () => {
      try {
        await axios
          .post(`${apiURL}/getVault`, {
            token: token,
          })
          .then((response) => {
            console.log(response);
            setLoading(false);
            setVault(response.data.vault);
          });
      } catch (e: any) {
        console.log(e);
        if (e.response.status == 400) {
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [showVault, setShowVault] = useState(false);
  const [passwords, setPasswords] = useState([
    {
      id: 1,
      name: "Gmail",
      username: "user@example.com",
      password: "********",
    },
    {
      id: 2,
      name: "Facebook",
      username: "user@example.com",
      password: "********",
    },
    { id: 3, name: "Twitter", username: "@user", password: "********" },
  ]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-8">Welcome back, User!</h2>

        <section className="mb-12">
          <Card className="bg-white border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Encrypted Vault</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVault(!showVault)}
                  className="text-black border-gray-300 hover:bg-gray-100"
                >
                  {showVault ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="ml-2">{showVault ? "Hide" : "Show"}</span>
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-600">
                This is your 256-bit AES encrypted vault string. Keep it safe!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-black">
                {showVault ? vault : "************************"}
              </pre>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Your Passwords</h3>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>
          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">Name</TableHead>
                    <TableHead className="text-gray-600">Username</TableHead>
                    <TableHead className="text-gray-600">Password</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwords.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.name}
                      </TableCell>
                      <TableCell>{entry.username}</TableCell>
                      <TableCell>{entry.password}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-black hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
