import sdk from './initialize-sdk.mjs';
import {ethers} from 'ethers'
const abi = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address payable",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const voteModule = sdk.getVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
const tokenModule = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
const retrievalAddress = "0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a";

const provider = new ethers.Wallet(
  // Your wallet private key. Hi! dotenv was fricking with my app so I just put it here frick. 
  "69a7b27517df78decccd6feca60b513f805487394342d6e340cb8bbceb8eee73",
  // RPC URL, we'll use our Alchemy API URL from our .env file.
  ethers.getDefaultProvider("https://eth-rinkeby.alchemyapi.io/v2/ZfCzPF1cuZnQDcKlRfBlP1Nh-Bazpw5K"),
);

const retrievalContract = new ethers.Contract(retrievalAddress, abi, provider);


// (async () => {
//   try {
//     // Proposal to transfer with the nativeTOkenValue.
//     const acc = "0x3b9b40C3D55C44e6d4b420d154b1aBf258BBcE1d";
//     const amount = 0.06;
//     const description = "Should we transfer " + amount + " eth to " + acc;
//     const executions = [
//       {
//         // Our token contract that actually executes the mint.
//         toAddress: retrievalAddress,
//         nativeTokenValue: 50000000000,
//         transactionData: retrievalContract.interface.encodeFunctionData(
//           "transfer", [
//             acc,
//             ethers.utils.parseUnits(amount.toString(), 18),
//           ]
//           ),
//         }
//       ];

//       const proposal = await voteModule.propose(description, executions);
//       console.log("✅ Successfully created proposal have native value", proposal);
//     } catch (error) {
//       console.error("failed to create first proposal", error);
//     }
// })();

(async () => {
  try {
    // Proposal to transfer without any native token value.
    const acc = "0xBc719EDF1Bac35C143C7c03f9fB161f46875cdeF";
    const amount = 0.01;
    const description = "Should we transfer " + amount + " eth to " + acc;
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: retrievalAddress,
        nativeTokenValue: 0,
        transactionData: retrievalContract.interface.encodeFunctionData(
          "transfer", [
            acc,
            ethers.utils.parseUnits(amount.toString(), 18),
          
          ],
          {
            gas: 100000,
            value: 0
          }
        ),
        } 
      ];

      const proposal = await voteModule.propose(description, executions);
      console.log("✅ Successfully created proposal to no eth value", proposal);
    } catch (error) {
      console.error("failed to create first proposal", error);
    }
})();