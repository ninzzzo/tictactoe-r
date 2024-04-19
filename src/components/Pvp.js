import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pvp.css';
import moveSound from './move.MP3';
import winSound from './win.MP3';
import clickSound from './click.mp3';



export const Pvp = () => {
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
    console.log("Playing win sound");
    console.log("mySound.Sound:", mySound.Sound);
    if (mySound.Sound === 'On') {
      console.log("Playing win sound now");
      winSoundAudio.play();
    }
  };



  const clickSoundAudio = new Audio(clickSound);
  const moveSoundAudio = new Audio(moveSound);
  const winSoundAudio = new Audio(winSound);


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

  const handleBoxClick = (index) => {
    if (boxes[index] || winner) return;
    const newBoxes = [...boxes];
    newBoxes[index] = turn0 ? 'O' : 'X';
    setBoxes(newBoxes);
    playMoveSound();
    setTurn0(!turn0);
    checkWinner(newBoxes);
  };


  const checkWinner = (newBoxes) => {
    for (let pattern of winPatterns) {
      const [pos1, pos2, pos3] = pattern;
      if (newBoxes[pos1] && newBoxes[pos1] === newBoxes[pos2] && newBoxes[pos1] === newBoxes[pos3]) {
        setWinner(newBoxes[pos1]);
        setMsgVisible(true);
        drawLine(boxRefs.current[pos1], boxRefs.current[pos3]);
        playWinSound();
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
    playClickSound();
    setWinner('');
    setBoxes(Array(9).fill(''));
    setMsgVisible(false);
    setLineStyle({});
    winSoundAudio.pause();
  };

  const stopAllSounds = () => {
    [ moveSoundAudio, winSoundAudio].forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  return (
    <div style={myStyle}>
      <h1 id="navbar">Player vs Player</h1>
      <hr />
      <div id="parentContainer" >
        <div id="container">
          {boxes.map((box, index) => (
            <button key={index} className="boxp" ref={(el) => (boxRefs.current[index] = el)} onClick={() => handleBoxClick(index)}>
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
        <Link to="/"><button id="BackBtn" onClick={()=>{playClickSound();stopAllSounds()}}>Back</button></Link>
        <button id="NewGame" onClick={newGame}>New Game</button>
      </div>
    </div>


  );
};
