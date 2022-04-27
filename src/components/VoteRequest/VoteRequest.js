import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import {useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from "@thirdweb-dev/react";
import './VoteRequest.css'

export default function VoteRequest() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let vote = useVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
    let token = useToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
    const [signer, setSigner] = useState({});

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
    const retrievalAddress = "0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a";
    const retrievalContract = new ethers.Contract(retrievalAddress, abi, provider)

    useEffect(async ()=>{
        console.log("Provider:",provider);
        setSigner(await provider.getSigner());
    },[])

    // Form shit that is stored in state
    const [formData, setFormData] = useState({
        proposalDesc: "",
        proposalType: "",
        receipient: "",
        amount: 0,
    })

    function handleChange(event){
        const {name, value} = event.target;
        setFormData((prevState) => {
            return {
                ...prevState,
                 [name]: value,
            }
        })
        console.log(formData);
    }

    function handleChange2(event) {
        const {name, value} = event.target;
        setFormData((prevState) => {
            return {
                ...prevState,
                 [name]: value,
            }
        })
        console.log(formData);
        event.preventDefault();
    }

    async function handleProposal(){
        try {
            console.log("Starting proposal")
            // proposal to transfer to address
            const acc = formData.receipient;
            const amount = formData.amount;
            const description = formData.proposalDesc + ` (${amount} eth to ${acc})`;
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

            console.log("finished variabels Before propose")
            const proposal = await vote.propose(description, executions);
            console.log("✅ Successfully created proposal to fund eth", proposal);
        } catch (error) {
                console.error("failed to create first proposal", error);
        }
    }
    

    return (
        <div>
            <div className="VoteRequest-Form">
                <div className="VoteRequest-Blocks">
                    <label>
                        Proposal Description
                        <textarea name="proposalDesc" 
                            value={formData.proposalDesc} 
                            onChange={handleChange} 
                            type="text"
                        >
                        </textarea>
                    </label>
                    <label>
                        Proposal Type
                        <select name="proposalType"
                            value={formData.proposalType}
                            onChange={handleChange}
                        >
                            <option value="addyFund">Funding people</option>
                            <option value="bruh">Funding bruhs</option>
                        </select>
                    </label>
                    <label>
                        Recipient
                        <textarea name="receipient" 
                            value={formData.receipient} 
                            onChange={handleChange} 
                            type="text"
                        >
                        </textarea>
                    </label>
                    <label>
                        Amount
                        <input type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            name="amount"
                        ></input>                        
                    </label>
                    <button onClick={handleProposal} >submit a proposal</button>
                </div>
            </div>
            
        </div>
    )
}