import React from "react";
import './footer.css'
import logo from '../Logo.png'
import {Link} from 'react-router-dom'

export const Footer = ({}) => {
  return (
    
      <div class="footer">
        <div class="footer-container-1">
            <div class="footer-item footer-item-1">Resources</div>
            <div class="footer-item footer-item-2"><Link to="/" >Home</Link></div>
            <div class="footer-item footer-item-3"><Link to="/vote">Vote</Link></div>
            <div class="footer-item footer-item-4"><Link to="/mint">Mint</Link></div>
            <div class="footer-item footer-item-5"><a target="_blank" href= "https://ppldao.notion.site/PeopleDAO-b9afff6c05f94269a69d31cf538d58b8">Docs</a></div>
        </div>

        <div class="footer-container-2">
            <div class="footer-item footer-item-1">About us</div>
            <div class="footer-item footer-item-2">Mission</div>
            <div class="footer-item footer-item-3">Contact us</div>
            <div class="footer-item footer-item-4"></div>
            <div class="footer-item footer-item-5"></div>
        </div>

        <div class="people-logo" >
            <img src={logo} />
        </div>
    </div>
    
  )
}


