import React, { useEffect, useState} from 'react'
import "./Vote.css"
import ComingSoon from "../ComingSoon.js"
import {ethers} from 'ethers'
import {ThirdwebSDK, VoteModule} from '@3rdweb/sdk'
import sdk from '../scripts/initialize-sdk.mjs';

export default function VotePage() {
    let provider = {};
    let signer = {};
    let address = ""
    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const voteModule = sdk.getVoteModule("0x289a8A52DdD41f7aFDd9D7760cFDe811974Ef753");
    const tokenModule = sdk.getTokenModule("0x13531C50c086D5330E93D95B691EC2f88363cF61");
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

    // Get all the proposals from the contract.
    useEffect (async () => {
        try {
            const proposals = await voteModule.getAll();
            setProposals(proposals);
            console.log("Proposals:", proposals);
        } catch (error) {
            console.log("Failed to get proposals", error);
        }
    }, [])

    useEffect(async () => {
        if (!proposals.length) {
            return;
        }
        try {
            const hasVoted = await voteModule.hasVoted(proposals[0].proposalsId, address);
            setHasVoted(hasVoted);
            if (hasVoted) {
                console.log("User already Voted")
            } else {
                console.log("User hasn't voted yet")
            }
        } catch (error) {
            console.log("Failed to check if wallet has voted", error);
        }
    }, [proposals, address])

    return (
        <div>
            <ComingSoon />
        </div>
    )
}