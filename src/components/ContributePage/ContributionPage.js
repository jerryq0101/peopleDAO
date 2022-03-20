import React, {Component, useEffect, useState} from 'react'
import './Contribution.css'
import {ethers} from 'ethers'
import file from './PPL_CrowdSale.json'

export default function ContributionPage(props) {
    const [treasury, setTreasury] = useState(0);
    const [donation, setDonation] = useState(0);
    const price = props.exchangeRate;
    let provider = {};
    let signer = {};
    let address = ""
    const saleContractAddress = "0x1E73b6847A224e48b7F3FbC2301F5DFb0eA502a9";
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
        //console.log("realContract:", realSalesContract);
    })();


    useEffect(async ()=> {
        // Get Treasury $$$
        const etherscanKey = "WI2YJVC8ZC1NGFBJIAANFAD1CWY3DD4F7W";
        const treasuryAddy = "0x328f4fade8026b82D0fcA401BDc4A230Cca77664";
        const response = await fetch(`https://api-rinkeby.etherscan.io/api?module=account&action=balance&address=${treasuryAddy}&tag=latest&apikey=${etherscanKey}`);
        let actualData = await response.json();
            //console.log(actualData);
        const money = ethers.utils.formatEther(actualData.result);
        const formattedMoney = parseFloat(money).toFixed(2);
        setTreasury(formattedMoney);

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
            }, 9000)
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

    return (
        <div className="Contribution-Page">
            <div className="Contribution-MiniPage">
                {/* // Figure out how to get ether in contract on here. */}
                <div className="Contribution-Title">
                    Ξ {treasury} Funded
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