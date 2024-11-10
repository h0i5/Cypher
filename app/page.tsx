"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Github,
  Key,
  Scan,
  Cloud,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container px-4 md:px-6 mx-auto max-w-6xl"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                  Secure Your Digital Life with Cypher
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  End-to-end encrypted password management using 256-bit AES
                  encryption and PBKDF2. Open source and secure.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="w-full max-w-sm space-y-2"
              >
                <Link href="/register" passHref>
                  <Button className="w-full sm:w-auto">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start securing your passwords today.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-black"
        >
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <motion.h2
              viewport={{ once: true }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
            >
              Key Features
            </motion.h2>
            <motion.div
              viewport={{ once: true }}
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: Lock,
                  title: "End-to-End Encryption",
                  description:
                    "Your data is encrypted and decrypted only on your device, ensuring maximum privacy.",
                },
                {
                  icon: Key,
                  title: "256-Bit AES Encryption",
                  description:
                    "Military-grade encryption to keep your passwords safe from any threats.",
                },
                {
                  icon: ShieldCheck,
                  title: "PBKDF2 Key Derivation",
                  description:
                    "Advanced key derivation for enhanced security against brute-force attacks.",
                },
                {
                  icon: Scan,
                  title: "Simplicity is Key",
                  description:
                    "The entire workflow at Cypher is airtight and industry standard.",
                },
                {
                  icon: Cloud,
                  title: "Secure Cloud Sync",
                  description:
                    "Safely sync your encrypted data across all your devices.",
                },
                {
                  icon: Github,
                  title: "Open Source",
                  description:
                    "Fully open source, allowing for community audits and contributions.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  viewport={{ once: true }}
                  variants={itemVariants}
                >
                  <Card className="h-full dark:bg-gray-900 dark:text-white">
                    <CardHeader>
                      <feature.icon className="h-12 w-12 mb-2 text-primary" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            viewport={{ once: true }}
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="container px-4 md:px-6 mx-auto max-w-6xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div variants={itemVariants} className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Open Source Security
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Cypher is fully open source, allowing for community audits and
                  contributions to ensure the highest level of security.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="w-full max-w-sm space-y-2"
              >
                <Button className="w-full" variant="outline">
                  View Source Code
                  <Github className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section
          id="github"
          className="w-full py-12 md:py-24 lg:py-32 bg-black text-white"
        >
          <motion.div
            viewport={{ once: true }}
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="container px-4 md:px-6 mx-auto max-w-6xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div viewport={{ once: true }} variants={itemVariants}>
                <Github className="h-16 w-16 mb-4" />
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                Contribute on GitHub
              </motion.h2>
              <motion.p
                viewport={{ once: true }}
                variants={itemVariants}
                className="mx-auto max-w-[700px] text-gray-300 md:text-xl"
              >
                Help make Cypher even better.
              </motion.p>
              <motion.div viewport={{ once: true }} variants={itemVariants}>
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Star on GitHub
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t dark:border-gray-800">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Cypher. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
