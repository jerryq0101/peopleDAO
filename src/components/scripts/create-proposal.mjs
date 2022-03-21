import sdk from './initialize-sdk.mjs';
import {ethers} from 'ethers'

const voteModule = sdk.getVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
const tokenModule = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
const crowdFundingAddress = "0x9A7a3FE1eE6C6Bc47958BFE17492EE0Bdd935Eab";

(async () => {
    try {
        const amount = 100;
        // Create proposal to mint 420,000 new token to the treasury.
        // await voteModule.propose(
        //   "Lets mint " + amount + " tokens into the treasury",
        //   [
        //     {
        //       // amount of eth
        //       nativeTokenValue: 0,
        //       transactionData: tokenModule.contract.interface.encodeFunctionData(
        //         // Mint into votemodule
        //         "mint",
        //         [
        //           voteModule.address,
        //           ethers.utils.parseUnits(amount.toString(), 18),
        //         ]
        //       ),
        //       // token module executes the mint
        //       toAddress: tokenModule.address,
        //     },
        //   ]
        // );
    
        // const proposals = await voteModule.getAll();
        // console.log("Proposals:", proposals);



        const description = "Lets mint " + amount + " of PPL Tokens into the crowdfunding contract";
        const executions = [
          {
            // Callin this address' mint method 
            toAddress: tokenModule.address,
            // The amount of eth sent in the tx
            nativeTokenValue: 0.01,
            // transaction data that is executed when proposal is executed
            transactionData: tokenModule.encoder.encode(
              "mintTo",
              [
                crowdFundingAddress,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),
          },
        ]
        const proposal = await voteModule.propose(description, executions);
        console.log("✅ Successfully created proposal to mint tokens", proposal);

      } catch (error) {
        console.error("failed to create first proposal", error);
      }
})();