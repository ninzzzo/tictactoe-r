import Home from './homepage/Home';
import { Pvp } from './components/Pvp';
import { Easy } from './components/Easy';
import { Hard } from './components/Hard';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

export default function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player-vs-player" element={<Pvp />} />
          <Route path="/player-vs-ai-easy" element={<Easy />} />
          <Route path="/player-vs-ai-hard" element={<Hard />} />
        </Routes>
      </HashRouter>
    </>
  );
}
