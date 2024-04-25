import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import homeStyle from './Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import clickSound from '../components/click.mp3';

const Home = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSocial, setShowSocial] = useState(false);
    const [showSocials, setShowSocials] = useState(false);

    const chooseMode = (event) => {
        setShowButtons(!showButtons);
        setShowSetting(false);
        setShowSettings(false);
        setShowSocials(false);
        setShowSocial(false);
        setShowMore(false);
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
            setShowSocial(false);
        }
    }
    const [myStyle, setMyStyle] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme
            ? JSON.parse(savedTheme)
            : {
                color: '#ffffff',
                backgroundColor: '#212121',
                boxShadow: '0 0 8px  rgba(0,0,0,0.3)',
            };
    });
    const [buttonStyle, setButtonStyle] = useState(() => {
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
    const toggleStyle = (event) => {
        event.stopPropagation();
        const newStyle = myStyle.color === '#ffffff' ? {
            color: '#212121',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 8px  rgba(0,0,0,0.3)',

        } : {
            color: '#ffffff',
            backgroundColor: '#212121',
            boxShadow: '0 0 8px  rgba(0,0,0,0.3)',
        };
        const buttonStyle = myStyle.color === '#ffffff' ? {
            color: 'black',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        } : {
            color: '#ffffff',
            backgroundColor: '#212121',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            border: '1px solid #adadad',
        };
        setMyStyle(newStyle);
        setButtonStyle(buttonStyle);
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
        <div className={homeStyle.startScreen} style={myStyle} >
            <div className={homeStyle.header}>
                <h1 className={homeStyle.head} >Tic Tac Toe</h1>
            </div>
            <div className={homeStyle.allBtn} onClick={hideMode}>
                <Link to='/player-vs-player'><button className={homeStyle.pvp} style={buttonStyle} onClick={playClickSound}>Player vs Player</button></Link>

                {!showButtons && (
                    <button className={homeStyle.modeBtn} style={buttonStyle} onClick={(event) => { chooseMode(event); playClickSound(); }}>Player vs AI</button>
                )}
                {showButtons && (
                    <div className={homeStyle.modeContainer} onClick={(event) => event.stopPropagation()}>
                        <Link to='/player-vs-ai-easy' style={{ textDecoration: 'none' }}><button className={homeStyle.mode1} style={buttonStyle} onClick={playClickSound}>Easy</button></Link>
                        <Link to='/player-vs-ai-hard' style={{ textDecoration: 'none' }}><button className={homeStyle.mode2} style={buttonStyle} onClick={playClickSound}>Hard</button></Link>
                    </div>
                )}
                {!showMore && (
                    <button className={homeStyle.moreBtn} style={buttonStyle} onClick={() => { chooseMore(); playClickSound() }}>More</button>
                )}
                <div className={`${homeStyle.moreContainer} ${showMore ? 'show' : 'hide'}`} onClick={(event) => event.stopPropagation()}>
                    {showSocial && <button className={homeStyle.more1} style={buttonStyle} onClick={() => { revealSocials(); playClickSound(); }}>Social</button>}
                    {showSetting && (
                        <button className={homeStyle.more2} style={buttonStyle} onClick={() => { chooseSetting(); playClickSound() }}>Setting</button>
                    )}
                </div>
                {showSettings && (
                    <div className={homeStyle.settingContainer} >
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="soundSwitch" onClick={(event) => { toggleSound(event); event.stopPropagation(); playClickSound() }} checked={mySound.Sound === 'On'} />
                            <label className={"custom-control-label"} htmlFor="soundSwitch">{SoundText}</label>
                        </div>
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="themeSwitch" onClick={(event) => { toggleStyle(event); event.stopPropagation(); playClickSound() }} checked={myStyle.color === '#ffffff'} />
                            <label className="custom-control-label" htmlFor="themeSwitch">{ThemeText}</label>
                        </div>
                    </div>
                )}
                {showSocials && (
                    <div className={homeStyle.socials}>
                        <button className={homeStyle.socialBtn1} style={myStyle} onClick={() => { window.open("https://www.instagram.com/ninzzzo"); playClickSound(); }}>
                            <FontAwesomeIcon icon={faInstagram} />
                        </button>
                        <button className={homeStyle.socialBtn2} style={myStyle} onClick={() => { window.open("https://github.com/ninzzzo"); playClickSound(); }}>
                            <FontAwesomeIcon icon={faGithub} />
                        </button>
                        <button className={homeStyle.socialBtn3} style={myStyle} onClick={() => { window.open("https://www.linkedin.com/in/ninzzzo"); playClickSound(); }}>
                            <FontAwesomeIcon icon={faLinkedin} />
                        </button>
                        <button className={homeStyle.socialBtn4} style={myStyle} onClick={() => { window.open("https://www.youtube.com/@ninzzzo"); playClickSound(); }}>
                            <FontAwesomeIcon icon={faYoutube} />
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
export default Home;

