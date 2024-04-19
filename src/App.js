import Home from './components/Home';
import { Pvp } from './components/Pvp';
import { Easy } from './components/Easy';
import { Hard } from './components/Hard';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player-vs-player" element={<Pvp />} />
          <Route path="/player-vs-ai-easy" element={<Easy />} />
          <Route path="/player-vs-ai-hard" element={<Hard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
