import React from 'react'
import './Contribution.css'
import {Link} from 'react-router-dom';

export default function Contribution() {

    return (
        <div className="Contribution">
            <Link to="/contribute">
                <div className="Contribution-btn">
                    
                        <div className="Contribution-btn-text">
                            Contribute
                        </div>
                    
                </div>
            </Link>
        </div>
    )
}