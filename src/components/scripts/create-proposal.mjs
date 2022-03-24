import sdk from './initialize-sdk.mjs';
import {ethers} from 'ethers'

const voteModule = sdk.getVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
const tokenModule = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");

const retrievalContract = "0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a"; 
(async () => {
    try {
        const amount = 0.5;
        const description = "Lets give " + amount + " of eth to " + "0x6902702BB5678D7361C94441c71F600C255dd833";
        const executions = [
          {
            // Callin this address' transfer eth method 
            toAddress: retrievalContract,
            // The amount of eth sent in the tx (Gas fees)
            nativeTokenValue: 3000000,
            // transaction data that is executed when proposal is executed
            transactionData: tokenModule.encoder.encode(
              "transfer",
              [
                "0x6902702BB5678D7361C94441c71F600C255dd833",
                ethers.utils.parseUnits("0.5", 18),
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