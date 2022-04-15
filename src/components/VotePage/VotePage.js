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
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);

    }, []);

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
        })
        sdk.updateSignerOrProvider(signer);
        transferContractW = new ethers.Contract("0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a", pplmeta.abi, provider);
        transferContractS = transferContractW.connect(signer);
    }, [provider]);

    // useEffect(() => {
    //   // Passing the signer to the sdk
    //   sdk.updateSigner
    //   // so we can use interact 
    // });

    useEffect(()=>{
      // Getting all of the proposals 
        // vote is the vote module
      vote.getAll().then((list) => {
          setProposals(list);
          console.log("Proposals:", proposals);
      })
      .catch((error) => {
        console.error("Failed to get all proposals", error);
      })
    }, [])

    const [hasFunds, setHasFunds] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    // Did user fund dao yet
    useEffect(async ()=>{
      if (!address) {
        return;
      } 

      try {
        const balance = await token.balanceOf(address);
        if (ethers.utils.parseUnits(balance, 18) > 0) {
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
    }, [address]);

    // Did user vote on the latest proposal
    useEffect(async () => {
      // check if proposal has been loaded
      if (!proposals.length) {
        return;
      }

      try {
        const voteStatus = await vote.hasVoted(proposals[proposals.length-1].proposalId, address);
        setHasVoted(voteStatus);
        console.log("Successfully got hasvoted or not")
      } catch (error) {
        console.error("Failed to get voteStatus for last proposal", error);
      }
    }, [proposals, address])

    if (loading) {
      return (
          <div className="loader-container">
              <img src={logo} className="loader"></img>
          </div>
      )
    }
    

    return (
      <div className="VotePage">
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="VotePage-card">
                  <h5 className="VotePage-card-Query">{proposal.description}</h5>
                  <div className="VotePage-card-Choices">
                    {proposal.votes.map(({ type, label }) => (
                      <div className="VotePage-card-choice" key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                          
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="VotePage-Submit" disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small className='VotePage-Submit-desc'>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
      </div>
    )
    
}