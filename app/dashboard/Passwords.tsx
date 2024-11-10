/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Dices } from "lucide-react";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { password_generator } from "../components/password-generator";
import { Plus, Trash, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { apiURL } from "../components/links";
const { createHash } = require("crypto");
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const { convertFromAES, convertToAES } = require("@harshiyer/json-crypto");

type Password = {
  id: number;
  name: string;
  username: string;
  password: string;
  salt: string;
};

type DecryptedData = {
  inputJSON: {
    passwords: Password[];
    username: string;
  };
};

type AESObject = {
  derivedKey: string;
  salt: string;
  aesString: string;
  sha256key: string;
};

export default function Passwords(props: { aesString: string; salt: string }) {
  const { aesString, salt } = props;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [decryptedData, setDecryptedData] = useState<DecryptedData>();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [showEncryptionPassword, setShowEncryptionPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState({
    name: "",
    username: "",
    password: "",
    salt: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({});
  const [masterPassword, setMasterPassword] = useState("");
  const [newAesString, setNewAesString] = useState<AESObject>();
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState<number | null>(
    null,
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<number | null>(null);

  // Open the delete confirmation dialog
  const confirmDelete = (id: number) => {
    setPasswordToDelete(id);
    setShowDeleteDialog(true);
  };

  // Handle the actual deletion after confirmation
  const handleDelete = async () => {
    if (passwordToDelete === null) return;

    try {
      // Filter out the password entry to delete
      const updatedPasswords = passwords.filter(
        (password) => password.id !== passwordToDelete,
      );
      setPasswords(updatedPasswords);

      // Encrypt the updated passwords list
      const newAesObject = await convertToAES(
        { passwords: updatedPasswords, username: username },
        masterPassword,
      );
      setNewAesString(newAesObject);

      // Send the updated vault data to the server
      const token = getCookie("token");
      const response = await axios.post(`${apiURL}/updateVault`, {
        username: username,
        aesString: newAesObject.aesString,
        salt: newAesObject.salt,
        token: token,
      });

      if (response.status === 200) {
        toast({
          title: "Password deleted successfully!",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "An error occurred while deleting the password.",
      });
    } finally {
      setShowDeleteDialog(false); // Close dialog after deletion
      setPasswordToDelete(null); // Reset state
    }
  };
  function updateData() {
    setPasswordVisibility((prev) => {
      const allFalse = Object.keys(prev).reduce(
        (acc, key) => {
          acc[Number(key)] = false;
          return acc;
        },
        {} as { [key: number]: boolean },
      );

      return allFalse;
    });
    try {
      let decrypted;
      if (newAesString) {
        decrypted = convertFromAES(
          newAesString.aesString,
          masterPassword,
          newAesString.salt,
        );
      } else {
        decrypted = convertFromAES(aesString, masterPassword, salt);
      }
      setDecryptedData(decrypted);
      setPasswords(decrypted.inputJSON.passwords);
      setUsername(decrypted.inputJSON.username);
      toast({
        title: "Synced successfully!",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Some problem occurred!",
      });
    }
  }

  useEffect(() => {
    setMasterPassword(localStorage.getItem("master_password") || "");
    if (aesString && salt) {
      updateData();
    }
  }, [aesString, salt]);

  const handleAddNew = async () => {
    if (newPassword.name && newPassword.username && newPassword.password) {
      setShowAddNew(false);
      setShowEncryptionPassword(true);
    } else {
      toast({
        variant: "destructive",
        title: "Please fill all fields!",
      });
    }
  };

  const handleEncryptAndSave = async () => {
    setLoading(true);
    try {
      await axios
        .post(`${apiURL}/verifyEncryptionPassword`, {
          encryption_password: await createHash("sha256")
            .update(encryptionPassword)
            .digest("hex"),
          token: getCookie("token"),
        })
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            toast({
              title: "Password Verified Successfully!",
            });
          }
          setLoading(false);
        });
    } catch (e: any) {
      console.log(e);
      if (e.response.status == 401) {
        toast({
          variant: "destructive",
          title: "Incorrect Encryption Password!",
        });
        setLoading(false);
      }
      setLoading(false);
      return;
    }

    const encryptedAESPassword = convertToAES(
      newPassword.password,
      encryptionPassword,
    );
    console.log(encryptedAESPassword);

    if (encryptionPassword) {
      const newEntry = {
        id: passwords.length + 1,
        ...newPassword,
        password: encryptedAESPassword.aesString,
        salt: encryptedAESPassword.salt,
      };
      const updatedPasswords = [...passwords, newEntry];

      setPasswords(updatedPasswords);

      try {
        const newAesObject = await convertToAES(
          { passwords: updatedPasswords, username: username },
          masterPassword,
        );

        setNewAesString(newAesObject);

        const token = getCookie("token");
        const response = await axios.post(`${apiURL}/updateVault`, {
          username: username,
          aesString: newAesObject.aesString,
          salt: newAesObject.salt,
          token: token,
        });

        if (response.status === 201) {
          toast({ title: "Updated successfully" });
        }
      } catch (e: any) {
        console.error(e);
        toast({
          variant: "destructive",
          title:
            e.response?.status === 400
              ? "Account already exists!"
              : "An error occurred!",
        });
      }

      setNewPassword({ name: "", username: "", password: "", salt: "" });
      setEncryptionPassword("");
      setShowEncryptionPassword(false);
      toast({ title: "New password added successfully!" });
    } else {
      toast({
        variant: "destructive",
        title: "Please enter your encryption password!",
      });
    }
  };

  const router = useRouter();

  const togglePasswordVisibility = (id: number) => {
    setSelectedPasswordId(id);
    setShowDecryptDialog(true);
  };

  const handleDecrypt = async () => {
    if (selectedPasswordId === null) return;

    try {
      // Hash encryption password
      const hashedPassword = await createHash("sha256")
        .update(encryptionPassword)
        .digest("hex");

      // Verify encryption password with API
      const response = await axios.post(`${apiURL}/verifyEncryptionPassword`, {
        encryption_password: hashedPassword,
        token: getCookie("token"),
      });

      if (response.status === 200) {
        // Find selected password entry
        const selectedPassword = passwords.find(
          (p) => p.id === selectedPasswordId,
        );
        console.log(selectedPassword);

        if (selectedPassword) {
          // Attempt decryption
          const decryptedPassword = convertFromAES(
            selectedPassword.password,
            encryptionPassword,
            selectedPassword.salt,
          );

          console.log(decryptedPassword);

          // Update state to show decrypted password
          setPasswordVisibility((prev) => ({
            ...prev,
            [selectedPasswordId]: true,
          }));

          setPasswords((prev) =>
            prev.map((p) =>
              p.id === selectedPasswordId
                ? { ...p, password: decryptedPassword.inputJSON }
                : p,
            ),
          );
        }

        // Close dialog and reset encryption password state
        setShowDecryptDialog(false);
        setEncryptionPassword("");
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Incorrect Encryption Password!",
      });
    }
  };

  return (
    <div>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Your Passwords</h3>
          <div className="flex justify-end items-center gap-x-2">
            <Button onClick={updateData} type="button">
              Update
            </Button>

            <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
              <DialogTrigger asChild>
                <Button type="button">
                  <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="name"
                      value={newPassword.name}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={newPassword.username}
                      onChange={(e) =>
                        setNewPassword({
                          ...newPassword,
                          username: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <div className="relative ">
                        <Input
                          id="password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword.password}
                          onChange={(e) =>
                            setNewPassword({
                              ...newPassword,
                              password: e.target.value,
                            })
                          }
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          setNewPassword({
                            ...newPassword,
                            password: password_generator(10),
                          });
                          toast({
                            description: "Password generated successfully!",
                          });
                        }}
                      >
                        <Dices className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddNew}>Add Password</Button>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showEncryptionPassword}
              onOpenChange={setShowEncryptionPassword}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Encryption Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="encryptionPassword" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="encryptionPassword"
                      type="password"
                      value={encryptionPassword}
                      onChange={(e) => setEncryptionPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={handleEncryptAndSave}
                  className="w-full bg-black dark:bg-gray-200 text-white dark:text-black"
                >
                  {loading ? (
                    <ClipLoader size="12" color="#ffffff" />
                  ) : (
                    "Encrypt and Save"
                  )}
                </Button>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showDecryptDialog}
              onOpenChange={setShowDecryptDialog}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Encryption Password to View</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="decryptPassword" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="decryptPassword"
                      type="password"
                      value={encryptionPassword}
                      onChange={(e) => setEncryptionPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleDecrypt}
                  className="w-full bg-black dark:bg-gray-200 text-white dark:text-black"
                >
                  Decrypt and View
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-gray-300">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300">
                    Username
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300">
                    Password
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passwords &&
                  passwords.map((entry) => (
                    <TableRow key={entry.id} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-gray-300">
                        {entry.name}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {entry.username}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {passwordVisibility[entry.id]
                          ? entry.password
                          : "••••••••"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => togglePasswordVisibility(entry.id)}
                          >
                            {passwordVisibility[entry.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => confirmDelete(entry.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>

                          <Dialog
                            open={showDeleteDialog}
                            onOpenChange={setShowDeleteDialog}
                          >
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <p>
                                  Are you sure you want to delete this password?
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => setShowDeleteDialog(false)}
                                  variant="secondary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleDelete}
                                  variant="destructive"
                                  className="bg-red-600 text-white"
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
