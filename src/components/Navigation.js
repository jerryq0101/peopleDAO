import React from "react";
import styled from "styled-components";
import { Link} from 'react-router-dom'
import {Connect} from './Connect.js';
import logo from './Logo.png'

import './Navigation.css'

export default function Navigation() {
  return (
    <div>
      <header>
        <Link to="/" style={{textDecoration: 'none' }}>
          <div class="logo">
              <img class="logo-img" src= {logo} alt="logo" />
              <div class="logo-text">PeopleDAO</div>
          </div>
        </Link>
         <nav>
             <ul class="nav_links">
                 <Link to="/mint"><li>Mint</li></Link>
                 <Link to="/vote" style={{textDecoration: 'none' }}>
                   <li><a href="#">Vote</a></li>
                  </Link>
                 <li><a href="#">Docs</a></li>
             </ul>
         </nav>
         <a class="cta"><Connect /></a>
      </header>
    </div>
  )
}