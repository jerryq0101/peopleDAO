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
        <Link to="/">
        <div class="logo">
            <img class="logo-img" src= {logo} alt="logo" />
            <div class="logo-text">PeopleDAO</div>
        </div>
        </Link>
         <nav>
             <ul class="nav_links">
                 <li>Request</li>
                 <Link to="/vote"><li><a href="#">Vote</a></li></Link>
                 <li><a href="#">Docs</a></li>
             </ul>
         </nav>
         <a class="cta"><Connect /></a>
      </header>
    </div>
  )
}