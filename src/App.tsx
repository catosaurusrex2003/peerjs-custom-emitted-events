import { useState, useEffect } from "react";
import Peer, { ConnectionType, DataConnection } from "peerjs";

const App = () => {
  const [peerId, setPeerId] = useState("");
  const [otherPeerId, setOtherPeerId] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connectionState, setConnectionState] = useState<
    DataConnection | undefined
  >(undefined);

  const connectToPeer = () => {
    if (!peer) return;
    const conn = peer?.connect(otherPeerId);
    conn.on("open", () => {
      setMessages((prev: any) => [
        ...prev,
        { text: "Connected to the other user", sender: "System" },
      ]);
    });
    setConnectionState(conn);
  };

  const sendMessage = () => {
    if (!connectionState) return;
    connectionState.send(inputMessage);
    setMessages((prev: any) => [...prev, { text: inputMessage, sender: "Me" }]);
    setInputMessage("");
  };

  const handleMessageChange = (event: any) => {
    setInputMessage(event.target.value);
  };

  const handleOtherPeerIdChange = (event: any) => {
    setOtherPeerId(event.target.value);
  };

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on("open", (id) => {
      setPeerId(id);
    });
    newPeer.on("connection", (conn) => {
      conn.on("data", (data) => {
        setMessages((prev: any) => [...prev, { text: data, sender: "Them" }]);
      });
    });
    setPeer(newPeer);
  }, []);

  return (
    <div>
      <h1>Peer-to-Peer Communication</h1>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <strong>Your ID: </strong>
          {peerId}
        </div>
        <div className="flex bg-gray-200 border border-gray-400 px-3 py-1 gap-3">
          <input
            type="text"
            value={otherPeerId}
            onChange={handleOtherPeerIdChange}
            placeholder="Enter other peer ID"
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded-md"
            onClick={connectToPeer}
          >
            Connect
          </button>
        </div>
        <div className="flex bg-gray-200 border border-gray-400 px-3 py-1 gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={handleMessageChange}
            placeholder="Type a message"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg: any, index: any) => (
            <li key={index}>
              <strong>{msg.sender}: </strong>
              {msg.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
