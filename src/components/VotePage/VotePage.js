import React, { useEffect, useState} from 'react'
import "./VotePage.css"
import ComingSoon from "../ComingSoon.js"
import sdk from '../scripts/initialize-sdk.mjs';
import {ethers} from 'ethers'
import { AddressZero} from '@ethersproject/constants'
import { ProposalState, ThirdwebSDK } from '@thirdweb-dev/sdk';
import logo from '../Logo.png'
import ProgressBar from './ProgressBar.js';

export default function VotePage() {
    let signer = {};
    let address = ""
    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider)
    let vote = sdk.getVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
    let token = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");

    const crowdfundingAddress = "0x9A7a3FE1eE6C6Bc47958BFE17492EE0Bdd935Eab";
    const [totalSupply, setTotalSupply] = useState(0);
    const [displayed, setDisplayed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, [])

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
    }, [provider])

    // Get all the proposals from the contract and execute
    useEffect (async () => {
        try {
            const propos = await vote.getAll();
            setProposals(propos);
            console.log("Proposals: ", propos);
        } catch (error) {
            console.log("Failed to get and execute proposals", error);
        }

        try {
          const totalSup = await token.totalSupply();
          const totalSupBN = await totalSup.value._hex;
          const totalSupInt = await parseInt(totalSupBN, 16);
          await setTotalSupply(totalSupInt);
       } catch (error) {
         console.error("Failed to set total supply")
       }
    }, []);
    
    useEffect(() => {
        
        setDisplayed(
            proposals
            .filter((proposal)=> {
                if (proposal.state === 1) {
                    return true;
                } 
                return false;
            })
            .map((proposal) => {
                    const forVotesBN = proposal.votes[1].count._hex;
                    const forVotesInt = parseInt(forVotesBN, 16);
                    console.log("For Votes for this proposal: ", forVotesInt);
                    const percentageFinished = forVotesInt / totalSupply * 100;
                    console.log("Percentage Finished:", percentageFinished);
                    
                    return (
                        <div key={proposal.proposalId} className="VotePage-card">
                            <div className="VotePage-card-left">
                              <h5 className="VotePage-card-Query">{proposal.description}</h5>
                              <div className="VotePage-card-Choices">
                                  {proposal.votes.map(({ type, label }) => {  
                                          return (
                                              <div key={type} className="VotePage-card-choice">
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
                                          );
                                      }
                                  )}
                              </div>
                            </div>
                            <div className="VotePage-card-right">
                              <ProgressBar done={percentageFinished} />
                            </div>
                            
                        </div>
                    )
                
            })
        )
        console.log("Displayed Elements:", displayed);
    }, [proposals, totalSupply])
    
    if (loading) {
        return (
            <div className="loader-container">
                <img src={logo} className="loader"></img>
            </div>
        )
    }

    return (
        <div className="VotePage">
            <div className="VotePage-Innerblock">
            <form className="VotePage-form"
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = 
                  proposals
                .filter((proposal)=> {
                    if (proposal.state === 1) {
                        return true;
                    } 
                    return false;
                })
                .map((proposal) => {
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
                  console.log("Delegation:", delegation);
                  // // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                  //   //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote:_vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        console.log("ID", proposalId);
                        const proposal = await vote.get(proposalId);
                        console.log("Proposal", proposal)
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote, "I Support this");
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
              {
                  displayed.length ? displayed : 
                    <div className="VotePage-Proposals-NonActive">
                        No Active proposals at the moment, feel free to initiate one by interacting with the contract
                    </div>
              }
              <button disabled={isVoting || hasVoted} type="submit" className="VotePage-Submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small className="VotePage-Submit-desc">
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
    )
}