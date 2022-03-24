import React from "react";
import './footer.css'
import logo from '../Logo.png'

export const Footer = ({}) => {
  return (
    
      <div class="footer">
        <div class="footer-container-1">
            <div class="footer-item footer-item-1">Resources</div>
            <div class="footer-item footer-item-2">Home</div>
            <div class="footer-item footer-item-3">Vote</div>
            <div class="footer-item footer-item-4">Treasury</div>
            <div class="footer-item footer-item-5">Docs</div>
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


