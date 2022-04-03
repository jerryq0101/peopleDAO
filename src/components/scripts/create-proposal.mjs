import sdk from './initialize-sdk.mjs';
import {ethers} from 'ethers'

const voteModule = sdk.getVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
const tokenModule = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");

const retrievalContract = "0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a"; 
(async () => {
    try {
        // Create proposal to mint 420,000 new token to the treasury.
      const amount = 10_000;
      const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
      const executions = [
        {
          // Our token contract that actually executes the mint.
          toAddress: tokenModule.getAddress(),
          // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
          // to send in this proposal. In this case, we're sending 0 ETH.
          // We're just minting new tokens to the treasury. So, set to 0.
          nativeTokenValue: 0,
          // We're doing a mint! And, we're minting to the vote, which is
          // acting as our treasury.
          // in this case, we need to use ethers.js to convert the amount
          // to the correct format. This is because the amount it requires is in wei.
          transactionData: tokenModule.encoder.encode(
            "mintTo", [
              voteModule.getAddress(),
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
            ),
          }
        ];

        const proposal = await voteModule.propose(description, executions);
        console.log("✅ Successfully created proposal to mint tokens", proposal);

      } catch (error) {
        console.error("failed to create first proposal", error);
      }
})();