import React from "react";
import Intro from "./Intro";
import Questions from "./Questions";

export default function App() {
  const [startGame, setStartGame] = React.useState(false);
  function startHandlerBtn() {
      setStartGame( !startGame);
  };

  return (
    <main>
    { !startGame &&
      <Intro
      handlerBtn ={startHandlerBtn}
      startState={startGame}
      />
    }
    {startGame && <Questions /> }
    </main>
  );
}

