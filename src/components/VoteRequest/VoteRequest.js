import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import {useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from "@thirdweb-dev/react";
import './VoteRequest.css'

export default function VoteRequest() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let vote = useVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
    let token = useToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
    const [signer, setSigner] = useState({});

    useEffect(async () => {
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x4' }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x4',
                      chainName: 'Rinkeby Test Network',
                      rpcUrls: ['https://rinkeby.infura.io/v3/'] /* ... */,
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
              }
            }
            // handle other "switch" errors
          }
    }, [])

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
                window.alert("Proposal failed. Do you have enough governance tokens?")
        }
    }
    

    return (
        <div>
            <div className="VoteRequest-Form">
                <div className="VoteRequest-Blocks">
                    <div className="VoteRequest-block">
                        <div className="VoteRequest-text">Proposal Description</div>
                        <div className="VoteRequest-desc">
                            The message shown to voters.
                        </div>
                        <textarea name="proposalDesc" 
                            value={formData.proposalDesc} 
                            onChange={handleChange} 
                            type="text"
                            className="VoteRequest-textarea"
                        >
                        </textarea>
                    </div>
                    <div className="VoteRequest-block">
                        <div className="VoteRequest-text">Proposal Type</div>
                        <div className="VoteRequest-desc">
                            Who is being funded
                        </div>
                        <select name="proposalType"
                            value={formData.proposalType}
                            onChange={handleChange}
                            className="VoteRequest-select"
                        >
                            <option value="addyFund">Requesting funding to an address</option>
                        </select>
                    </div>
                    <div className="VoteRequest-block">
                        <div className="VoteRequest-text">Receipient</div>
                        <div className="VoteRequest-desc">Address being funded</div>
                        <textarea name="receipient" 
                            value={formData.receipient} 
                            onChange={handleChange} 
                            type="text"
                            className="VoteRequest-textarea"
                        >
                        </textarea>
                    </div>
                    <div className="VoteRequest-block">
                        <div className="VoteRequest-text">Amount</div>
                        <div className="VoteRequest-desc">
                            Amount of Ether requesting
                        </div>
                        <input type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            name="amount"
                            className="VoteRequest-number"
                        ></input>                        
                    </div>
                    <div className="VoteRequest-block">
                        <button className="VoteRequest-btn" onClick={handleProposal} >Submit proposal</button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}