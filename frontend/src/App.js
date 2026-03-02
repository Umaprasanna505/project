import { Routes, Route } from "react-router-dom";
import Home from ".//Pages/Homepage";
import Chat from "./Pages/Chatpage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
        </Routes>
    );
}

export default App;