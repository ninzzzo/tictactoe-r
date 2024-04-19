import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Easy.css';
import moveSound from './move.MP3';
import winSound from './win.MP3';
import clickSound from './click.mp3';
import LossSound from './loss.MP3';



export const Hard = () => {

  const [mySound, setMySound] = useState(() => {
    const savedSound = localStorage.getItem('sound');
    return savedSound ? JSON.parse(savedSound) : { Sound: 'On' };
  });

  const playClickSound = () => {
    if (mySound.Sound === 'On') {
      clickSoundAudio.play();
    }
  };

  const playMoveSound = () => {
    if (mySound.Sound === 'On') {
      moveSoundAudio.play();
    }
  };

  const playWinSound = () => {
    if (mySound.Sound === 'On') {
      winSoundAudio.play();
    }
  };

  const playLossSound = () => {
    if (mySound.Sound === 'On') {
      lossSoundAudio.play();
    }
  };


  const clickSoundAudio = new Audio(clickSound);
  const moveSoundAudio = new Audio(moveSound);
  const winSoundAudio = new Audio(winSound);
  const lossSoundAudio = new Audio(LossSound);


  useEffect(() => {
    const savedSound = localStorage.getItem('sound');
    if (savedSound) {
      setMySound(JSON.parse(savedSound));
    }
  }, []);


  
  const [turn0, setTurn0] = useState(true);
  const [winner, setWinner] = useState('');
  const [lineStyle, setLineStyle] = useState({});
  const [msgVisible, setMsgVisible] = useState(false);
  const [boxes, setBoxes] = useState(Array(9).fill(''));
  let gameStatus = false;

  const [myStyle, setMyStyle] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme
      ? JSON.parse(savedTheme)
      : {
        color: '#ffffff',
        backgroundColor: '#212121',
      };
  });

  

  useEffect(() => {
    const savedSound = localStorage.getItem('sound');
    if (savedSound) {
      setMySound(JSON.parse(savedSound));
    }

    // Determine who starts the game
    const shouldAIPlayFirst = !lastStarterAI;

    // If AI starts, make the AI's move first
    if (shouldAIPlayFirst) {
      setTimeout(() => {
        aiTurn(Array(9).fill(''));
      }, Math.random() * 1000);
    }

    // Update who started the last game
    setLastStarterAI(!lastStarterAI);
  }, []);


  const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const playerTurn = (index) => {
    if (turn0 && !winner && boxes[index] === '') {
      const newBoxes = [...boxes];
      newBoxes[index] = 'O';
      setBoxes(newBoxes);
      setTurn0(false);
      playMoveSound();
      checkWinner(newBoxes);
      setTimeout(() => aiTurn(newBoxes), 100);
    }
  };

  

  const aiTurn = (currentBoxes) => {

    if (gameStatus || checkWinner(currentBoxes)) return;
   
    
    const emptyBoxes = currentBoxes.reduce((acc, box, index) => (box === '' ? [...acc, index] : acc), []);

    const winningMoveIndex = checkForWinningMove(currentBoxes, 'X');
    if (winningMoveIndex !== -1) return makeMove(currentBoxes, winningMoveIndex, 'X');

    const blockingMoveIndex = checkForWinningMove(currentBoxes, 'O');
    if (blockingMoveIndex !== -1) return makeMove(currentBoxes, blockingMoveIndex, 'X');

    if (currentBoxes[4] === 'O' && ([0, 2, 6, 8].some(index => currentBoxes[index] === 'X')) && currentBoxes[3] === 'O' && currentBoxes[5] === '') {
      return makeMove(currentBoxes, 5, 'X');
    }
    if (currentBoxes[4] === 'O' && ([0, 2, 6, 8].some(index => currentBoxes[index] === 'X')) && currentBoxes[1] === 'O' && currentBoxes[7] === '') {
      return makeMove(currentBoxes, 7, 'X');
    }
    if (currentBoxes[4] === 'O' && ([0, 2, 6, 8].some(index => currentBoxes[index] === 'X')) && currentBoxes[5] === 'O' && currentBoxes[3] === '') {
      return makeMove(currentBoxes, 3, 'X');
    }
    if (currentBoxes[4] === 'O' && ([0, 2, 6, 8].some(index => currentBoxes[index] === 'X')) && currentBoxes[7] === 'O' && currentBoxes[1] === '') {
      return makeMove(currentBoxes, 1, 'X');
    }
    


    if (currentBoxes[0] === 'X' && currentBoxes[4] === 'O' && currentBoxes[8] === '') {
      return makeMove(currentBoxes, 8, 'X');
    }
    if (currentBoxes[2] === 'X' && currentBoxes[4] === 'O' && currentBoxes[6] === '') {
      return makeMove(currentBoxes, 6, 'X');
    }
    if (currentBoxes[6] === 'X' && currentBoxes[4] === 'O' && currentBoxes[2] === '') {
      return makeMove(currentBoxes, 2, 'X');
    }
    if (currentBoxes[8] === 'X' && currentBoxes[4] === 'O' && currentBoxes[0] === '') {
      return makeMove(currentBoxes, 0, 'X');
    }
    if (currentBoxes[4] === '' && emptyBoxes.length === 8 && [0, 2, 6, 8].some(index => currentBoxes[index] === 'O')) {
      return makeMove(currentBoxes, 4, 'X');
    }

    if (currentBoxes[0] === 'O' && currentBoxes[4] === 'X' && currentBoxes[8] === 'O' && (currentBoxes[1] === '' || currentBoxes[7] === '' || currentBoxes[5] === '' || currentBoxes[3] === '')) {
      const availablePositions = [1, 3, 5, 7].filter(pos => currentBoxes[pos] === '');
      return makeMove(currentBoxes, availablePositions[Math.floor(Math.random() * availablePositions.length)], 'X');
    }
    if (currentBoxes[2] === 'O' && currentBoxes[4] === 'X' && currentBoxes[6] === 'O' && (currentBoxes[1] === '' || currentBoxes[7] === '' || currentBoxes[5] === '' || currentBoxes[3] === '')) {
      const availablePositions = [1, 3, 5, 7].filter(pos => currentBoxes[pos] === '');
      return makeMove(currentBoxes, availablePositions[Math.floor(Math.random() * availablePositions.length)], 'X');
    }
    if (currentBoxes[6] === 'O' && currentBoxes[4] === 'X' && currentBoxes[2] === 'O' && (currentBoxes[1] === '' || currentBoxes[7] === '' || currentBoxes[5] === '' || currentBoxes[3] === '')) {
      const availablePositions = [1, 3, 5, 7].filter(pos => currentBoxes[pos] === '');
      return makeMove(currentBoxes, availablePositions[Math.floor(Math.random() * availablePositions.length)], 'X');
    }
    if (currentBoxes[8] === 'O' && currentBoxes[4] === 'X' && currentBoxes[1] === 'O' && (currentBoxes[1] === '' || currentBoxes[7] === '' || currentBoxes[5] === '' || currentBoxes[3] === '')) {
      const availablePositions = [1, 3, 5, 7].filter(pos => currentBoxes[pos] === '');
      return makeMove(currentBoxes, availablePositions[Math.floor(Math.random() * availablePositions.length)], 'X');
    }

 

    const emptyCorners = emptyBoxes.filter(index => [0, 2, 6, 8].includes(index));
    if (emptyCorners.length > 0) return makeMove(currentBoxes, emptyCorners[Math.floor(Math.random() * emptyCorners.length)], 'X');

    const userPlayedCenter = currentBoxes[4] === 'O';
    if (userPlayedCenter) {
      const oppositeCorner = getOppositeCorner(currentBoxes);
      if (oppositeCorner !== -1 && emptyBoxes.includes(oppositeCorner)) {
        return makeMove(currentBoxes, oppositeCorner, 'X');
      }
    }
    const emptySides = emptyBoxes.filter(index => [1, 3, 5, 7].includes(index));
    if (emptySides.length > 0) return makeMove(currentBoxes, emptySides[Math.floor(Math.random() * emptySides.length)], 'X');
  };


  

  const getOppositeCorner = (currentBoxes) => {
    const corners = [0, 2, 6, 8];
    const middle = 4;
    const userCornerIndex = currentBoxes.findIndex((box, index) => corners.includes(index) && box === 'O');
    if (userCornerIndex !== -1) {
      const oppositeIndex = Math.abs(userCornerIndex - middle);
      return corners.includes(oppositeIndex) ? oppositeIndex : -1;
    }
    return -1;
  };
  const checkForWinningMove = (boxes, symbol) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6] 
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (boxes[a] === symbol && boxes[b] === symbol && boxes[c] === '') return c;
      if (boxes[a] === symbol && boxes[b] === '' && boxes[c] === symbol) return b;
      if (boxes[a] === '' && boxes[b] === symbol && boxes[c] === symbol) return a;
    }

    return -1;
  };




  const makeMove = (currentBoxes, index, symbol) => {
    setTimeout(() => {
      const newBoxes = [...currentBoxes];
      newBoxes[index] = symbol;
      setBoxes(newBoxes);
      setTurn0(true);
      checkWinner(newBoxes);
    }, Math.random() < 0.5 ? 600 : 1500);
  };

  const checkWinner = (newBoxes) => {
    for (let pattern of winPatterns) {
      const [pos1, pos2, pos3] = pattern;
      if (newBoxes[pos1] && newBoxes[pos1] === newBoxes[pos2] && newBoxes[pos1] === newBoxes[pos3]) {
        const winnerSymbol = newBoxes[pos1];
        setWinner(winnerSymbol);
        setMsgVisible(true);
        drawLine(boxRefs.current[pos1], boxRefs.current[pos3]);
        gameStatus = true;
        if (winnerSymbol === 'O') {
          playWinSound();
        } else {
          playLossSound();
        }
        return;
      }
    }
  };

  const boxRefs = useRef([]);
  boxRefs.current = new Array(9).fill(null);

  const drawLine = (start, end) => {
    const rect1 = start.getBoundingClientRect();
    const rect2 = end.getBoundingClientRect();
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);
    setLineStyle({
      width: `${length}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 0',
      left: `${x1}px`,
      top: `${y1}px`,
      position: 'absolute',
      display: 'block',
    });
  };

  // Define a state variable to keep track of who started last
  const [lastStarterAI, setLastStarterAI] = useState(false);

  const newGame = (event) => {
    event.stopPropagation();
    setTimeout(() => {
      // Determine who starts the game
      const aiStarts = !lastStarterAI;

      // If AI starts, make the AI's move first
      if (aiStarts) {
        aiTurn(Array(9).fill(''));
      }

      // Set initial game state
      setTurn0(!aiStarts);
      setWinner('');
      setBoxes(Array(9).fill(''));
      setMsgVisible(false);
      setLineStyle({});
      playClickSound();
      gameStatus = false;

      // Update who started the last game
      setLastStarterAI(!lastStarterAI);
    });
  };



  const stopAllSounds = () => {
    [moveSoundAudio, winSoundAudio].forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  return (
    <div style={myStyle}>
      <div className="navbar">
        <div>
          <h1>Player vs AI</h1>
          <h6>Hard Mode</h6>
        </div>
      </div>
      <hr />
      <div id="parentContainer">
        <div id="container">
          {boxes.map((box, index) => (
            <button key={index} className="boxp" ref={(el) => (boxRefs.current[index] = el)} onClick={() => playerTurn(index)} >
              {box}
            </button>
          ))}

        </div>
        <div className={`msg-container ${msgVisible ? '' : 'hide'}`}>
          <p id="msg">{winner ? `${winner} Wins` : "It's a draw!"}</p>
        </div>
        <div id="line" style={lineStyle}></div>
      </div>
      <div id="BtnBox">
        <Link to="/"><button id="BackBtn" onClick={() => { playClickSound(); stopAllSounds() }}>Back</button></Link>
        <button id="NewGame" onClick={newGame}>New Game</button>
      </div>
    </div>
  );
};


