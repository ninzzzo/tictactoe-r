import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Easy.css';
import moveSound from './move.MP3';
import winSound from './win.MP3';
import clickSound from './click.mp3';
import LossSound from './loss.MP3';


export const Easy = () => {

  const [mySound, setMySound] = useState(() => {
    const savedSound = localStorage.getItem('sound');
    return savedSound ? JSON.parse(savedSound) : { Sound: 'On' };
  });

  useEffect(() => {
    const savedSound = localStorage.getItem('sound');
    if (savedSound) {
      setMySound(JSON.parse(savedSound));
    }
  }, []);

  const clickSoundAudio = new Audio(clickSound);
  const moveSoundAudio = new Audio(moveSound);
  const winSoundAudio = new Audio(winSound);
  const lossSoundAudio = new Audio(LossSound);


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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setMyStyle(JSON.parse(savedTheme));
    }
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
      playMoveSound();
      setTurn0(false);
      checkWinner(newBoxes);
      setTimeout(() => aiTurn(newBoxes), 100);
    }
  };

  const aiTurn = (currentBoxes) => {
    playMoveSound();
    if (gameStatus) return;
    if (winner || checkWinner(currentBoxes)) {
      return;
    }
    const emptyBoxes = currentBoxes.map((box, index) => (box === '' ? index : null)).filter((index) => index !== null);
    if (emptyBoxes.length === 0) {
      return;
    }
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
      const selectedIndex = emptyBoxes[randomIndex];
      const newBoxes = [...currentBoxes];
      playMoveSound();
      newBoxes[selectedIndex] = 'X';
      setBoxes(newBoxes);
      setTurn0(true);
      checkWinner(newBoxes);
    }, Math.random() < 0.5 ? 600 : 1300);
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

  const newGame = () => {
    setTurn0(true);
    setWinner('');
    setBoxes(Array(9).fill(''));
    setMsgVisible(false);
    setLineStyle({});
    playClickSound();
    winSoundAudio.pause();
    stopAllSounds(); 
    winSoundAudio.currentTime = 0;
    gameStatus = false;
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
          <h6>Easy Mode</h6>
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


