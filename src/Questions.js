import React from "react";
import {nanoid } from "nanoid";
import {decode} from "html-entities";

export default function Questions() {
    const [questionAndAnswers, setQuestionAndAnswers] = React.useState([]);
    const [showWarning, setShowWarning] = React.useState(false);
    const [numCorrectAnswers, setNumCorrectAnswers] = React.useState(0);
    const [showResult, setShowResults ] = React.useState(false);

    React.useEffect( ()=> {
        if(questionAndAnswers.length === 0){
            fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
            .then( res => res.json())
            .then( data=> { 
                // each item will be an object of
                   /*
                    -question
                    -shuffledAnswer
                    -correctAnswer
                    -selectedAnswer
    
                    */
    
                setQuestionAndAnswers(data.results.map(questionObject=>{
                    return {
                        question: decode(questionObject.question),
                        shuffledAnswer: shuffle([...questionObject.incorrect_answers, questionObject.correct_answer]),
                        correctAnswer: decode(questionObject.correct_answer),
                        selectedAnswer: decode("")
                    }
                } ));
    
              
            });

        }
     
    },[questionAndAnswers]);

  
    function clickHandler(answer, currentQuestion){
        setQuestionAndAnswers(prevState=> prevState.map( object=>
            {
            return object.question === currentQuestion ? {...object, selectedAnswer: answer} : object ;
            }))
    };

    const renderQuestionsAndAnswers = questionAndAnswers.map( (questionObject, index)=>{
        return ( 
            <div key={nanoid()} className="singleQuestion-container">
                    <h1 key={index} className="header">{questionObject.question}</h1>
                    <div className="btns-container">
                            { questionObject.shuffledAnswer.map(answer=> {
                                return(
                                        <button 
                                                onClick={ ()=>clickHandler(decode(answer),questionObject.question) }
                                                key={nanoid()}
                                                className= { ` answer-btn ${decode(answer) === questionObject.selectedAnswer ? "selected-answer": "" }
                                                           ${showResult&& decode(answer) === questionObject.correctAnswer ? "correct-answer": ""}
                                                           ${showResult&&
                                                             decode(answer) !== questionObject.correctAnswer &&
                                                             decode(answer) === questionObject.selectedAnswer ? "incorrect-answer": ""
                                                            }
                                                            ${showResult? "dimmed":""}
                                                           `
                                                             }    
                                                disabled={showResult}
                                        >
                                                            {decode(answer)}
                                        </button>
                                )
                                })}
                    </div>
            </div>
    )
})

    // start of shuffle array function
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
    // end of shuffle array function


          function checkAnswersHandler(){
          const notAllAnswered =   questionAndAnswers.some( object=>{
              return object.selectedAnswer === "" ;
            })
            setShowWarning(notAllAnswered);

            if(!notAllAnswered){
                questionAndAnswers.forEach( object=>{
                    if(object.selectedAnswer === object.correctAnswer){
                    setNumCorrectAnswers(prevCount=> prevCount+1);
                    setShowResults(true);
                    }else{
                        return numCorrectAnswers;
                    }
                })
            }
          };

          function setNewQuize(){ 
            setQuestionAndAnswers([]);
            setShowWarning(false);
            setShowResults(false);
            setNumCorrectAnswers(0);
          };


          

          
        return (
        <div  className="question-page">
            {renderQuestionsAndAnswers}
            { showWarning ? <p className="warning-text">You haven't answered all questions</p>: ""}
           { questionAndAnswers.length >0 && !showResult ?
            <div className="check-btn-container">  
                  <button onClick={checkAnswersHandler} className="check-btn">Check answers</button> 
            </div> : null
           }

           {showResult&& <div className="result-container">
                <p className="result-message"> You scored {numCorrectAnswers}/5 correct answers </p> 
                <button onClick={setNewQuize} className="playAgain-btn"> Play Again </button>
            </div>}
        </div>
    )}
           
  
