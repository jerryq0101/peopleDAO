import React, { useEffect, useState} from 'react'
import "./Vote.css"
import ComingSoon from "../ComingSoon.js"
import {ethers} from 'ethers'
import sdk from '../scripts/initialize-sdk.mjs';

export default function VotePage() {
    let provider = {};
    let signer = {};
    let address = ""
    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const voteModule = sdk.getVote("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
    const tokenModule = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
    const crowdfundingAddress = "0x9A7a3FE1eE6C6Bc47958BFE17492EE0Bdd935Eab";

    useEffect(() => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provider: ", provider);
        (async () => {
            await provider.send("eth_requestAccounts", );
        })();
        signer = provider.getSigner();
        signer.getAddress().then(addy => {
            console.log("Address of Signer:", addy)
            address = addy;
        })
    }, [])

    // Get all the proposals from the contract and execute
    useEffect (async () => {
        try {
            const propos = await voteModule.getAll();
            setProposals(propos);
            console.log("Proposals: ", propos);
            // Get the state of the thing
            const state9 = await propos[8].state;
            console.log("Proposal 8 state:", state9);
            // Execute if state if 4
            if (state9 === 4){
                const id = await propos[8].proposalId;
                const ex = await voteModule.execute(id);
                console.log(ex);
            }
        } catch (error) {
            console.log("Failed to get and execute proposals", error);
        }
    }, []);
    

    return (
        <div>
            <ComingSoon />
        </div>
    )
}