import React, { useEffect, useState} from 'react'
import "./VotePage.css"
import ComingSoon from "../ComingSoon.js"
import sdk from '../scripts/initialize-sdk.mjs';
import {ethers} from 'ethers'
import { AddressZero } from "@ethersproject/constants";
import { ProposalState , ChainId} from '@thirdweb-dev/sdk';
import {useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from "@thirdweb-dev/react";
import logo from '../Logo.png'
import ProgressBar from './ProgressBar.js';
import pplmeta from './peopletransfer.json';
import { Link} from 'react-router-dom'


export default function VotePage() {
    let signer = {};
    let address = ""
    const [proposals, setProposals] = useState([]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let vote = useVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
    let token = useToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
    let transferContractW;
    let transferContractS;
    const [loading, setLoading] = useState(true);
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        console.log("Provider: ", provider);
        console.log("Contract:", vote);
        (async () => {
            await provider.send("eth_requestAccounts", );
        })();
        signer = provider.getSigner();
        signer.getAddress().then(addy => {
            console.log("Address of Signer:", addy)
            address = addy;
            checkFund();
        })
        transferContractW = new ethers.Contract("0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a", pplmeta.abi, provider);
        transferContractS = transferContractW.connect(signer);
    }, [provider]);

    useEffect(async ()=>{
      // Getting all of the proposals 
        // vote is the vote module
      try {
        const p = await vote.getAll();
        setProposals(p);
        console.log(proposals);
      } catch (e) {
        console.error("failed to get proposals", e)
      }
      
    }, []);

    // useEffect(async ()=>{
    //   const abi = [
    //     {
    //       "inputs": [],
    //       "payable": false,
    //       "stateMutability": "nonpayable",
    //       "type": "constructor"
    //     },
    //     {
    //       "payable": true,
    //       "stateMutability": "payable",
    //       "type": "fallback"
    //     },
    //     {
    //       "constant": false,
    //       "inputs": [],
    //       "name": "deposit",
    //       "outputs": [],
    //       "payable": true,
    //       "stateMutability": "payable",
    //       "type": "function"
    //     },
    //     {
    //       "constant": false,
    //       "inputs": [
    //         {
    //           "internalType": "address payable",
    //           "name": "receiver",
    //           "type": "address"
    //         },
    //         {
    //           "internalType": "uint256",
    //           "name": "amount",
    //           "type": "uint256"
    //         }
    //       ],
    //       "name": "transfer",
    //       "outputs": [],
    //       "payable": false,
    //       "stateMutability": "nonpayable",
    //       "type": "function"
    //     },
    //     {
    //       "constant": false,
    //       "inputs": [
    //         {
    //           "internalType": "uint256",
    //           "name": "amount",
    //           "type": "uint256"
    //         }
    //       ],
    //       "name": "withdraw",
    //       "outputs": [],
    //       "payable": false,
    //       "stateMutability": "nonpayable",
    //       "type": "function"
    //     }
    //   ];
    //   const retrievalAddress = "0xeeb1292D56554ED31733Fa79De23Cf71ED9e67b3";
    //   const retrievalContract = new ethers.Contract(retrievalAddress, abi, provider);
    //   const rWithSigner = retrievalContract.connect(signer);
      
    //   try {
    //     await rWithSigner.transfer("0x0f845663158945694BEc5b2Ed69785E3e09d9912", ethers.utils.parseUnits("0.02", 18));
    //   } catch(error){
    //     console.error("Failed to transfer eth to this dude", error)
    //   }
    // },[])

    const [hasFunds, setHasFunds] = useState(false);
    // const [hasVoted, setHasVoted] = useState(false);
    const [allExecuted, setAllExecuted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [filterProposal, setFiltProposal] = useState([]);

    // Did user fund dao yet
    async function checkFund(){

      try {
        const balance = await token.balanceOf(address);
        if (ethers.utils.parseUnits(balance.displayValue, 18) > 0) {
          setHasFunds(true);
          console.log("This user has funded the DAO");
        } else {
          setHasFunds(false);
          console.log("This user did not fund the dao yet");
        }
      } catch (error) {
        setHasFunds(false);
        console.log("Failed to get balance", error);
      }
    }
    useEffect(() => {
      setTimeout(() => {
          setLoading(false);
      }, 1000);

    }, []);


    
    // check if every proposal has been executed (The last one)
    useEffect(async () => {
      // check if proposal has loaded
      if (!proposals.length) {
        return;
      }
      console.log("Proposals: ", proposals);

      // check
      try {
        const lastState = proposals[proposals.length-1].state; 
        if (lastState === 3 || lastState === 7) {
          setAllExecuted(true);
        }
      } catch (error) {
        console.error("Failed to set executed", error)
      }
      
    }, [proposals, address])

    // Does the filtered Proposals (Excluding all else not active ones: 4 and 7)
    useEffect(async () => {
      // Check if proposals exists 
      if (!proposals.length){
        return;
      }
      // set state
      setFiltProposal(
        proposals.filter(proposal => {
          if (proposal.state === 1 ){
            return true;
          } else {
            return false;
          }
        })
      );
    }, [proposals])

    if (loading) {
      return (
          <div className="loader-container">
              <img src={logo} className="loader"></img>
          </div>
      )
    }

    function stateQuestion(num){
      if (num === 1){
        return "Voting";
      } else if (num === 2) {
        return "Error";
      } else if (num === 3) {
        return "Vote Defeated";
      } else if (num === 4) {
        return "Success - Waiting to execute";
      } else if (num === 7) {
        return "Vote Executed";
      }
    }

    function stateColor(num) {
      if (num === 3) {
        return "#FFA1A1"
      } else if (num === 4) {
        return "#B4FF9F"
      } else if (num === 7) {
        return "#FFD59E"
      } else {
        return "none"
      }
    }
    

    return (
      <div className="VotePage">
          <div>
            <div>
              Make a proposal <Link to='/voterequest'>here</Link>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsExecuting(true);
                
                try {
                  // if any of the propsals are ready to be executed we'll need to execute them
                  // a proposal is ready to be executed if it is in state 4
                  await Promise.all(
                    proposals.map(async ({ proposalId }) => {
                      // get the latest state of the proposal again, since we may have just voted before
                      const proposal = await vote.get(proposalId);

                      //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                      if (proposal.state === 4) {
                        return vote.execute(proposalId);
                      }
                    })
                  );
                  // and log out a success message
                  console.log("successfully executed");
                } catch (err) {
                  console.error("failed to execute votes", err);
                }
                finally {
                // Finished executing so we can enable the btn again. 
                  setIsExecuting(false);
                } 
            }}
            >
              {filterProposal.length ? (filterProposal.map((proposal) => (
                <div key={proposal.proposalId} className="VotePage-card">
                  <h5 className="VotePage-card-Query">{proposal.description}</h5>
                  <div className="VotePage-card-Choices">
                    {proposal.votes.map(({ type, label }) => (
                      <div className="VotePage-card-choice" key={type}>
                        <input
                          type="button"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={(type)}
                          className="VotePage-proposal-button"
                          choice={type}
                          //default the "abstain" vote to checked
                          onClick={handleVote}
                          disabled={isVoting}
                        />
                        
                      </div>
                    ))}
                    <label className="VotePage-votestatus">
                         <span className="VotePage-votestatus-item">For: {parseInt(proposal.votes[1].count._hex, 16)}</span>
                         <span className="VotePage-votestatus-item">Against: {parseInt(proposal.votes[0].count._hex, 16)}</span>
                         <span className="VotePage-votestatus-item">Abstain: {parseInt(proposal.votes[2].count._hex, 16)}</span>
                    </label>
                    <div className="VotePage-question-cont">
                      
                      <div className="VotePage-question" >
                        {stateQuestion(proposal.state)}
                      </div>
                    </div>
                    
                  </div>
                </div>
              )))
              : 
              (<div className="VotePage-nonActive">
                No Active Proposals at the moment (1). 
              </div>)
              }

              <button className="VotePage-Submit" disabled={isExecuting || allExecuted} type="submit">
                {isExecuting
                  ? "Executing Proposals..."
                  : allExecuted
                    ? "All Proposals are Executed"
                    : "Execute Proposals"}
              </button>
              {(
                <small className='VotePage-Submit-desc'>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
      </div>
    )
    
    function getWord(type) {
      if (type === 1) {
        return "For"
      } else if (type === 0) {
        return "Abstain"
      } else {
        return "Against"
      }
    }
    
    function handleVote(event) {
      console.log(event.target.name);
      console.log(event.target.value);
      const choice = event.target.value;
      const id = event.target.name;
      console.log("Heyo Voting Beginning!");
      console.log("Choice:" + choice + " ID:" + id)
      setIsVoting(true);

      if (!hasFunds){
        window.alert("gtfo you didn't fund the dao yet bruv, go to the contribution!")
        setIsVoting(false);
        return;
      }

      // call function to check / DELEGATAE tokens for the proposal
      (async () => {
        console.log("Heyo check for delegation tokens")
        //we'll check if the wallet still needs to delegate their tokens before they can vote
        const delegation = await token.getDelegationOf(address);
        // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
        if (delegation === AddressZero) {
          //if they haven't delegated their tokens yet, we'll have them delegate them before voting
          await token.delegateTo(address);
        }

        // after the delegate check, execute the VOTING
        try {
          console.log("Getting the proposal")
          const proposal = await vote.get(id);

          if (proposal.state === 1) {
            try {
              return vote.vote(id, choice);
            } catch (error) {
              window.alert("You've already voted, or there's a proposal voting error")
            }
          } else {
            window.alert("Proposal does not accept votes anymore")
          }
        } catch (error) {
          console.error("Proposal Voting error", error);
        } finally {
          setIsVoting(false);
        }

      })();
    }
}