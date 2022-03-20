import React from 'react'
import './ProgressBar.css'

export default function ProgressBar(props) {

    const [style, setStyle] = React.useState({});

    setTimeout(() => {
        const newStyle = {
            opacity: 1,
            width: `${props.done}%`
        }
        setStyle(newStyle);
    });

    return (
        <div className="progress">
            <div className="progress-done" style={style}>

            </div>
        </div>
    )
}