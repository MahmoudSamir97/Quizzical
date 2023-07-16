import React from "react";
export default function Intro(props){
    return (
        <main>
         <h1 className="title-head">Quizzical</h1>
         <p className="title-info">Train yourself and gain knowledge!</p>
         <button className="start-btn" onClick={props.handlerBtn}>Start quiz</button>
        </main>
    )
}