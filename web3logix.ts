import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";


const generateMnemonicArray = () => {
    const mnemonic = generateMnemonic();
    const mnemonicArray = mnemonic.split(" ");
    console.log("Generated Mnemonic Array:", mnemonicArray);
    return mnemonicArray;
}




export default generateMnemonicArray;