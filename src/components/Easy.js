import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameStyle from './game.module.css';
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

  useEffect(() => {
    document.body.style.color = myStyle.color;
    document.body.style.backgroundColor = myStyle.backgroundColor;
  }, [myStyle]);


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
    if (checkWinner(currentBoxes)) {
      return;
    }
    if (gameStatus) return;
    if (winner || checkWinner(currentBoxes)) {
      return;
    }
    const emptyBoxes = currentBoxes.map((box, index) => (box === '' ? index : null)).filter((index) => index !== null);
    if (emptyBoxes.length === 0) {
      return;
    }
    playMoveSound();
    setTimeout(() => {
      if (checkWinner(currentBoxes)) {
        return;
      }
      const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
      const selectedIndex = emptyBoxes[randomIndex];
      const newBoxes = [...currentBoxes];
      playMoveSound();
      newBoxes[selectedIndex] = 'X';
      setBoxes(newBoxes);
      setTurn0(true);
      checkWinner(newBoxes);
    }, Math.random() < 0.5 ? 600 : 800);
  };

  const checkWinner = (newBoxes) => {
    let draw = true;
    for (let pattern of winPatterns) {
      const [pos1, pos2, pos3] = pattern;
      if (newBoxes[pos1] && newBoxes[pos1] === newBoxes[pos2] && newBoxes[pos1] === newBoxes[pos3]) {
        setWinner(newBoxes[pos1]);
        setMsgVisible(true);
        drawLine(boxRefs.current[pos1], boxRefs.current[pos3]);
        if (newBoxes[pos1] === 'O') {
          playWinSound();
        } else {
          playLossSound();
        }
        return true;
      }
    }
    for (let box of newBoxes) {
      if (box === '') {
        draw = false;
        break;
      }
    }
    if (draw) {
      setWinner('DRAW');
      setMsgVisible(true);
    }

  };

  const boxRefs = useRef([]);
  boxRefs.current = new Array(9).fill(null);
  const drawLine = (start, end) => {
    const rect1 = start.getBoundingClientRect();
    const rect2 = end.getBoundingClientRect();
    const containerRect = document.querySelector(`.${GameStyle.boxContainer}`).getBoundingClientRect();
    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;
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
      display: 'flex',
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
    winSoundAudio.currentTime = 0;
    gameStatus = false;
  };

  const [buttonStyle] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme
      ? JSON.parse(savedTheme).color === '#ffffff'
        ? {
          color: '#ffffff',
          backgroundColor: '#212121',
          boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          border: '1px solid #adadad',
        }
        : {
          color: 'black',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        }
      : {
        color: '#ffffff',
        backgroundColor: '#212121',
        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        border: '1px solid #adadad',
      };
  });

  return (
    <div className={GameStyle.game} style={{ ...myStyle, boxShadow: 'none' }}>
      <h1 className={GameStyle.navbar}>Player vs AI</h1>
      <div className={GameStyle.heading}>
        <h6>Easy Mode</h6>
      </div>
      <hr />
      <div className={GameStyle.mainBox} >

        <div className={GameStyle.boxContainer}>
          {boxes.map((box, index) => (
            <button key={index} className={GameStyle.box} ref={(el) => (boxRefs.current[index] = el)} onClick={() => playerTurn(index)}>
              {box}
            </button>
          ))}
        </div>
        <div className={`${GameStyle.msgContainer} ${msgVisible ? '' : 'hide'}`}>
          <p id="msg">
            {winner === 'DRAW' && 'DRAW'}
            {winner && winner !== 'DRAW' && `${winner} Wins`}
          </p>
        </div>

      </div>
      <div className={GameStyle.lineContainer}>
        <div className={GameStyle.line} style={lineStyle}></div>
      </div>

      <div className={GameStyle.Btnbox}>
        <button style={buttonStyle} className={GameStyle.Btn1} onClick={newGame}>New Game</button>
        <Link to="/" style={{ textDecoration: 'none' }}><button className={GameStyle.Btn2} style={buttonStyle} onClick={() => { playClickSound(); }}>Back</button></Link>
      </div>
    </div>
  );
};


