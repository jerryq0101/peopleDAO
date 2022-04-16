import React from 'react'
import './ProgressBar2.css'
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
        <div className="progress2">
            <div className="progress-done2" style={style}>
            </div>
        </div>
    )
}