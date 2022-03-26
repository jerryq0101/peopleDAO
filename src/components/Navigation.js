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
                 <Link to="/mint"><li className="links">Mint</li></Link>
                 <Link to="/vote" style={{textDecoration: 'none' }}>
                   <li className="links">Vote</li>
                  </Link>
                 <a target="_blank" href= "https://ppldao.notion.site/PeopleDAO-b9afff6c05f94269a69d31cf538d58b8"><li className="links">Docs</li></a>
             </ul>
         </nav>
         <a class="cta"><Connect /></a>
      </header>
    </div>
  )
}