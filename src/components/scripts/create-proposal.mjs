import sdk from './initialize-sdk.mjs';
import {ethers} from 'ethers'

const voteModule = sdk.getVoteModule("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
const tokenModule = sdk.getTokenModule("0x13531C50c086D5330E93D95B691EC2f88363cF61");
const crowdfundingAddress = "0x9A7a3FE1eE6C6Bc47958BFE17492EE0Bdd935Eab";

(async () => {
    try {
        const amount = 69;
        // Create proposal to mint 420,000 new token to the treasury.
        await voteModule.propose(
          "Should the DAO mint an additional " + amount + " tokens into the treasury?",
          [
            {
              // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
              // to send in this proposal. In this case, we're sending 0 ETH.
              // We're just minting new tokens to the treasury. So, set to 0.
              nativeTokenValue: 0,
              transactionData: tokenModule.contract.interface.encodeFunctionData(
                // We're doing a mint! And, we're minting to the voteModule, which is
                // acting as our treasury.
                "mint",
                [
                  voteModule.address,
                  ethers.utils.parseUnits(amount.toString(), 18),
                ]
              ),
              // Our token module that actually executes the mint.
              toAddress: tokenModule.address,
            },
          ]
        );
    
        console.log("✅ Successfully created proposal to mint tokens");
        const proposals = await voteModule.getAll();
        console.log("Proposals:", proposals);
      } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
      }
})();