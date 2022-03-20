import { ThirdwebSDK } from "@3rdweb/sdk";
import {ethers} from "ethers";

// //Importing and configuring our .env file that we use to securely store our environment variables
// import dotenv from "dotenv";
// dotenv.config();

// // Some quick checks to make sure our .env is working.
// if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
//   console.log("🛑 Private key not found.")
// }

// if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
//   console.log("🛑 Alchemy API URL not found.")
// }

// if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
//   console.log("🛑 Wallet Address not found.")
// }

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Your wallet private key. Hi! dotenv was fricking with my app so I just put it here frick. 
    "69a7b27517df78decccd6feca60b513f805487394342d6e340cb8bbceb8eee73",
    // RPC URL, we'll use our Alchemy API URL from our .env file.
    ethers.getDefaultProvider("https://eth-rinkeby.alchemyapi.io/v2/ZfCzPF1cuZnQDcKlRfBlP1Nh-Bazpw5K"),
  ),
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
  }
})()

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;