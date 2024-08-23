"use client";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

import React, { useState } from "react";
import Link from "next/link";
import { Button, ButtonProps } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  WalletIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useToast } from "./ui/use-toast";
import { generateMnemonic, mnemonicToSeed, mnemonicToSeedSync } from "bip39";
import generateMnemonicArray from "../web3logix";

interface Wallet {
  id: number;
  publicKey: string;
  privateKey: string;
}

export default function WalletPage() {
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string>("");
  const [isWalletGenerated, setIsWalletGenerated] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{
    [key: number]: boolean;
  }>({});
  const { toast } = useToast();

  const generateWallet = () => {
    const mnemonic = generateMnemonic();
    setGeneratedMnemonic(mnemonic);
    const mnemonicArray = mnemonic.split(" ");
    setSeedPhrase(mnemonicArray);
    setIsWalletGenerated(true);
    showNotification(
      "HD Wallet generated successfully!",
      "Your seed phrase has been created. Keep it safe!"
    );
  };

  const createNewWallet = () => {
    const seed = mnemonicToSeedSync(generatedMnemonic);
    const path = `m/44'/501'/${wallets.length}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKeyBase64 = Buffer.from(secret).toString("base64");

    const newWallet: Wallet = {
      id: Date.now(),
      publicKey: publicKey,
      privateKey: privateKeyBase64,
    };
    setWallets([...wallets, newWallet]);
    showNotification(
      "New wallet created",
      `Wallet #${wallets.length + 1} has been added to your account.`
    );
  };

  const togglePrivateKey = (id: number) => {
    setVisiblePrivateKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteWallet = (id: number) => {
    const walletIndex = wallets.findIndex((wallet) => wallet.id === id);
    setWallets(wallets.filter((wallet) => wallet.id !== id));
    setVisiblePrivateKeys((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    showNotification(
      "Wallet deleted",
      `Wallet #${walletIndex + 1} has been removed from your account.`
    );
  };

  const showNotification = (title: string, description: string) => {
    console.log("Showing notification:", title, description); // Debug log
    toast({
      title: title,
      description: description,
      duration: 4000,
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-[100dvh] bg-black text-white">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-red-900">
          <Link href="#" className="flex items-center justify-center">
            <WalletIcon className="h-6 w-6 text-red-700" />
            <span className="sr-only">CryptoWallet</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="https://github.com/fuyofulo"
              target="_blank"
              className="text-sm font-medium hover:text-red-500"
            >
              Github
            </Link>
            <Link
              href="https://twitter.com/fuyofulo"
              target="_blank"
              className="text-sm font-medium hover:text-red-500"
            >
              Twitter
            </Link>
            <Link
              href="https://linkedin.com/in/fuyofulo"
              target="_blank"
              className="text-sm font-medium hover:text-red-500"
            >
              LinkedIn
            </Link>
            <Link
              href="https://instagram.com/fuyofulo"
              target="_blank"
              className="text-sm font-medium hover:text-red-500"
            >
              Instagram
            </Link>
          </nav>
        </header>
        <main className="flex-1  bg-black text-white">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-red-600">
                    Secure Your Crypto with Our HD Wallet
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                    Create a hierarchical deterministic wallet for enhanced
                    security and easy management of your cryptocurrencies.
                  </p>
                </div>
                <div className="space-y-4 w-full max-w-md">
                  <Button
                    className="w-full bg-red-800 text-white hover:bg-red-900"
                    size="lg"
                    onClick={generateWallet}
                    disabled={isWalletGenerated}
                  >
                    {isWalletGenerated
                      ? "Wallet Generated"
                      : "Generate HD Wallet"}
                  </Button>
                  {isWalletGenerated && (
                    <>
                      <Collapsible className="w-full space-y-2">
                        <div className="flex items-center justify-between space-x-4 px-4">
                          <h4 className="text-sm font-semibold text-red-500">
                            Your Seed Phrase
                          </h4>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-9 p-0 text-red-500 hover:text-red-400"
                            >
                              <ChevronDownIcon className="h-4 w-4" />
                              <span className="sr-only">Toggle</span>
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="space-y-2">
                          <div className="rounded-md border border-red-900 bg-gray-900 px-4 py-3 font-mono text-sm text-red-400">
                            {seedPhrase.join(" ")}
                          </div>
                          <p className="text-xs text-gray-500">
                            Please store this seed phrase securely. It's crucial
                            for recovering your wallet.
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                      <Button
                        className="w-full bg-red-800 text-white hover:bg-red-900"
                        onClick={createNewWallet}
                      >
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Create New Wallet
                      </Button>
                      <div className="space-y-4">
                        {wallets.map((wallet, index) => (
                          <Card
                            width="500px"
                            key={wallet.id}
                            className="bg-gray-900 border-red-900"
                          >
                            <CardContent className="p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-red-500">
                                  Wallet {index + 1}
                                </h3>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-400"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-gray-800 border border-red-900">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-red-500">
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-400">
                                        This action cannot be undone. This will
                                        permanently delete your wallet.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-800 text-white hover:bg-red-900"
                                        onClick={() => deleteWallet(wallet.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-red-500">
                                  Public Key:
                                </span>
                                <span className="font-mono text-sm text-gray-300">
                                  {wallet.publicKey}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-red-500">
                                  Private Key:
                                </span>
                                <div className="flex items-center">
                                  <span className="font-mono text-sm mr-2 text-gray-300">
                                    {visiblePrivateKeys[wallet.id]
                                      ? wallet.privateKey
                                      : "••••••••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => togglePrivateKey(wallet.id)}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    {visiblePrivateKeys[wallet.id] ? (
                                      <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                      <EyeIcon className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-red-900">
          <p className="text-xs text-gray-500">
            © 2024 CryptoWallet. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:text-red-500">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-red-500">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
