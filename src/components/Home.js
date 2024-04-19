import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import clickSound from './click.mp3';



const Home = () => {

    
    const [showButtons, setShowButtons] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSocial, setShowSocial] = useState(false);
    const [showSocials, setShowSocials] = useState(false);

    const chooseMode = (event) => {
        setShowButtons(true);
        setShowMore(false);
        setShowSettings(false);
        setShowSocials(false);
        if (event) event.stopPropagation();
    };

    const chooseMore = () => {
        setShowMore(true);
        setShowButtons(false);
        setShowSetting(true);
        setShowSocial(true);
    };

    const revealSocials = () => {
        setShowSocials(true);
        setShowSocial(false);
        setShowSetting(false);
    };

    const chooseSetting = () => {
        setShowSettings(true);
        setShowSetting(false);
        setShowSocial(false);
    };

    const hideMode = (event) => {
        if (event.target === event.currentTarget) {
            setShowButtons(false);
            setShowMore(false);
            setShowSetting(false);
            setShowSettings(false);
            setShowSocials(false);
        }
    }

    const [myStyle, setMyStyle] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme
            ? JSON.parse(savedTheme)
            : {
                color: '#ffffff',
                backgroundColor: '#212121',
                border: '1px solid #ffffff'
            };
    });

    const toggleStyle = (event) => {
        event.stopPropagation();
        const newStyle = myStyle.color === '#ffffff' ? {
            color: '#212121',
            backgroundColor: '#ffffff',
            border: '1px solid #212121'
        } : {
            color: '#ffffff',
            backgroundColor: '#212121',
            border: '1px solid #ffffff'
        };
        setMyStyle(newStyle);
        const ThemeText = myStyle.color === '#212121' ? 'Dark Mode On' : 'Dark Mode Off'; setThemeText(ThemeText);
        localStorage.setItem('theme', JSON.stringify(newStyle));
    };

    const toggleSound = () => {
        const newSound = mySound.Sound === 'On'
            ? { Sound: 'Off' }
            : { Sound: 'On' };

        setMySound(newSound);
        setSoundText(newSound.Sound === 'On' ? 'Sound On' : 'Sound Off');
        localStorage.setItem('sound', JSON.stringify(newSound));
    };
    const [mySound, setMySound] = useState(() => {
        const savedSound = localStorage.getItem('sound');
        return savedSound ? JSON.parse(savedSound) : { Sound: 'On' };
    });
    const [SoundText, setSoundText] = useState(() => {
        return mySound.Sound === 'On' ? 'Sound On' : 'Sound Off';
    });

    const playClickSound = () => {
        const soundOn = mySound.Sound === 'On';
        if (soundOn) {
            const audio = new Audio(clickSound);
            audio.play();
        }
    };
    const [ThemeText, setThemeText] = useState(() => {
        return myStyle.color === '#212121' ? 'Dark Mode Off' : 'Dark Mode On';
    });
    useEffect(() => {
        document.body.style.color = myStyle.color;
        document.body.style.backgroundColor = myStyle.backgroundColor;
    }, [myStyle]);

    return (
        <div className="startScreen" style={myStyle} onClick={hideMode}>
            <h1 className="head" onClick={hideMode}>Tic Tac Toe</h1>
            <Link to='/player-vs-player'><button style={myStyle} className="pvp" onClick={playClickSound}>Player vs Player</button></Link>

            {!showButtons && (
                <button className="mode-btn" style={myStyle} onClick={(event) => { chooseMode(event); playClickSound(); }}>Player vs AI</button>
            )}
            <div className={`mode-container ${showButtons ? 'show' : 'hide'}`} onClick={(event) => event.stopPropagation()}>
                <Link to='/player-vs-ai-easy'><button className="mode" onClick={playClickSound} style={myStyle} >Easy</button></Link>
                <Link to='/player-vs-ai-hard'><button className="mode" onClick={playClickSound} style={myStyle}>Hard</button></Link>
            </div>

            {!showMore && (
                <button className="more-btn" style={myStyle} onClick={() => { chooseMore(); playClickSound() }}>More</button>
            )}
            <div className={`more-container ${showMore ? 'show' : 'hide'}`} onClick={(event) => event.stopPropagation()}>
                {showSocial && <button className="more" style={myStyle} onClick={() => { revealSocials(); playClickSound(); }}>Social</button>}
                {showSetting && (
                    <button className="more" style={myStyle} onClick={() => { chooseSetting(); playClickSound() }}>Setting</button>
                )}
            </div>
            {showSettings && (
                <div className="setting-container">
                    <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="soundSwitch" onClick={(event) => { toggleSound(event); event.stopPropagation(); playClickSound() }} checked={mySound.Sound === 'On'} />
                        <label className="custom-control-label" htmlFor="soundSwitch">{SoundText}</label>
                    </div>
                    <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="themeSwitch" onClick={(event) => { toggleStyle(event); event.stopPropagation(); playClickSound() }} checked={myStyle.color === '#ffffff'} />
                        <label className="custom-control-label" htmlFor="themeSwitch">{ThemeText}</label>
                    </div>
                </div>
            )}
            {showSocials && (
                <div id="socialContainer" className="pop-up">
                    <button id="socials" onClick={() => { window.open("https://www.instagram.com/ninzzzo"); playClickSound(); }}>
                        <FontAwesomeIcon icon={faInstagram} />
                    </button>
                    <button id="socials" onClick={() => { window.open("https://github.com/ninzzzo"); playClickSound(); }}>
                        <FontAwesomeIcon icon={faGithub} />
                    </button>
                    <button id="socials" onClick={() => { window.open("https://www.linkedin.com/in/ninzzzo"); playClickSound(); }}>
                        <FontAwesomeIcon icon={faLinkedin} />
                    </button>
                    <button id="socials" onClick={() => { window.open("https://www.youtube.com/@ninzzzo"); playClickSound(); }}>
                        <FontAwesomeIcon icon={faYoutube} />
                    </button>
                </div>

            )}

        </div>
    );
}

export default Home;
