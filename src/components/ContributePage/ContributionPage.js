import React, {Component, useEffect, useState} from 'react';
import './Contribution.css';
import {ethers} from 'ethers';
import file from './PPL_CrowdSale.json';
import sdk from '../scripts/initialize-sdk.mjs';
import logo from '../Logo.png'

export default function ContributionPage(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 4500)
    }, [])

    
    const [treasury, setTreasury] = useState(0);
    const [donation, setDonation] = useState(0);
    const [tokensLeft, setTokensLeft] = useState(0);
    const price = props.exchangeRate;
    let provider = {};
    let signer = {};
    let address = ""
    const saleContractAddress = "0xbe83b5F628b2dD757b2D35D276588812a17Da45A";
    let salesContract = {};
    let realSalesContract = {};
    const [executeStart, setExecuteStart] = useState(false);
    const [executeEnd, setExecuteEnd] = useState(false);

     // Setting up all of the variables
    (async () => {
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
        salesContract = new ethers.Contract(saleContractAddress, file.abi, provider);
        //console.log("Contract:", salesContract)
        realSalesContract = salesContract.connect(signer);
        console.log("realContract:", realSalesContract);
    })();

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

    useEffect(async () => {
        // Get Treasury $$$
        const etherscanKey = "WI2YJVC8ZC1NGFBJIAANFAD1CWY3DD4F7W";
        const treasuryAddy = "0x7b06BDa105ef9A9028c9f7AA749B856754a4C66a";
        const response = await fetch(`https://api-rinkeby.etherscan.io/api?module=account&action=balance&address=${treasuryAddy}&tag=latest&apikey=${etherscanKey}`);
        let actualData = await response.json();
            //console.log(actualData);
        const money = ethers.utils.formatEther(actualData.result);
        const formattedMoney = parseFloat(money).toFixed(2);
        setTreasury(formattedMoney);

         // Tokens left in the crowdfunding 
        const tokenContract = sdk.getToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
        const balanceInCrowd = await tokenContract.balanceOf("0xbe83b5F628b2dD757b2D35D276588812a17Da45A");
        setTokensLeft(balanceInCrowd.displayValue);
    }, [executeEnd])

    async function handleSubmit(){
        // Something something transaction with donation
        console.log("FUCKKKKKKKKKKKK IT WORKSKSKSkSKSSs")
        // Transaction Execution
        setExecuteStart(true);
        realSalesContract.buyTokens(address, {
            value: ethers.utils.parseEther(""+donation),
            gasLimit: 3000000,
        }).then((transaction) => {
            console.log(transaction)
            setTimeout(()=>{
                setExecuteStart(false);
                setExecuteEnd(true);
                setTimeout(()=>setExecuteEnd(false), 1000)
            }, 10000)
        })
    }

    function handleChange(event){
        const updatevalue = event.target.value;
        if (updatevalue > 5000){
            // Limit on donation amount
        } else {
            setDonation(event.target.value);
        }
    }

    if (loading) {
        return (
            <div className="loader-container">
                <img src={logo} className="loader"></img>
            </div>
        )
    }

    return (
        <div className="Contribution-Page">
            <div className="Contribution-MiniPage">
                {/* // Figure out how to get ether in contract on here. */}
                <div className="Contribution-Title">
                    Ξ {treasury} Funded
                </div>
                <div className="Contribution-TokensLeft">
                    $PPL {tokensLeft} left
                </div>
                <input className="Contribution-Input" type="number" onChange={handleChange} value={donation}>
                </input>
                <div className="Contribution-SplitBtn">
                    <button className="Contribution-submitbtn" onClick={handleSubmit}>Donate</button>
                    <div className="Contribution-buffer"></div>
                    {/* eth -> usd conversion */}
                    <div className="Contribution-Convert">
                        <div>${parseFloat(price*donation).toFixed(1)}</div>
                    </div>
                </div>
                <div className="Contribution-Tokendesc">You will receive {donation} $PPL gTokens</div>
            </div>
        </div>
    )
}