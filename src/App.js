import Navigation from './components/Navigation.js'
import HomePage from './components/HomePage/HomePage'
import Vote from './components/VotePage/VotePage'
import {Footer} from './components/footer/Footer'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ContributionPage from './components/ContributePage/ContributionPage';
import {ChainId, ThirdwebProvider} from '@thirdweb-dev/react'
import { useEffect , useState} from 'react';
import {ethers} from 'ethers'
import sdk from './components/scripts/initialize-sdk.mjs'
import MintPage from './components/MintPage/MintPage.js';
import ScrollToTop from './ScrollToTop.js';

function App() {
  const [price, setPrice] = useState(0);
  const [treasury, setTreasury] = useState(0);
  const [tokensLeft, setTokensLeft] = useState(0);
  
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
    
    //Get Ethereum Exchange Rate
    const response2 = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR');
    let actualData2 = await response2.json();
    const usd = actualData2.USD;
    const ethPrice = parseFloat(usd).toFixed(1);
    setPrice(ethPrice);
  }, []);

  const application = (
    <Router>
      <ScrollToTop />
      <div className="App">
        {/* Navbar is always going to be here */}
        <Navigation />
        <div className="content">
          <Switch>  {/*  A switch statement to select the route of the website */}
            <Route exact path="/">
              <HomePage exchangeRate={price} ether={treasury}/>
            </Route>
            <Route exact path="/mint">
              <MintPage />
            </Route>
            <Route exact path="/vote">
              <Vote />
            </Route>
            <Route exact path="/contribute">
              <ContributionPage exchangeRate={price} ether={treasury}/>
            </Route>
          </Switch>
        </div>
        {/* The Current Footer that is here */}
        <Footer />
      </div>
    </Router>
    
  );
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Rinkeby}
    >
      {application}
    </ThirdwebProvider>
  )
}

export default App;
