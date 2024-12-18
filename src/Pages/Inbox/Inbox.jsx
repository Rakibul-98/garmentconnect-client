
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useNavigate } from "react-router";

export default function Inbox() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState({ country: "", industry: "" });
  const [reply, setReply] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    fetch("https://y-five-ashen.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        const matchingUser = data.filter((user) => user.user.email === auth.currentUser.email);
        if (matchingUser.length > 0) {
          const { country, industry } = matchingUser[0].user;
          setLoggedInUser({ country, industry });
        }
      });

    fetch("https://y-five-ashen.vercel.app/messages")
      .then((res) => res.json())
      .then((data) => {
        const filteredMessages = data.filter(
          (message) =>
            message.message.country === loggedInUser.country &&
            message.message.industry === loggedInUser.industry
        );
        setMessages(filteredMessages);
      });
  }, [auth, loggedInUser.country, loggedInUser.industry]);

  const fetchReplies = (messageId) => {
    fetch(`https://y-five-ashen.vercel.app/replies/${messageId}`)
      .then((res) => res.json())
      .then((data) => setReplies(data));
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    fetchReplies(message._id);
  };

  const handleReply = () => {
    const replyData = {
      messageId: selectedMessage._id,
      reply,
      date: new Date().toISOString(),
    };

    fetch("https://y-five-ashen.vercel.app/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(replyData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfirmation("Reply sent successfully!");
          setReply("");
          fetchReplies(selectedMessage._id);
          setTimeout(() => setConfirmation(""), 3000);
        } else {
          setConfirmation("Failed to send reply. Try again.");
        }
      });
  };

  const closeFullMessage = () => {
    setSelectedMessage(null);
    setReplies([]);
  };

  return (
    <div className="mt-20 mx-auto max-w-4xl p-4 mb-10 lg:mb-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
        <div className="flex items-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow mr-3"
            onClick={() => navigate("/sent-replies")}
          >
            View Replies
          </button>
          <button
            className="text-4xl text-blue-500 hover:text-blue-600"
            onClick={() => navigate("/compose")}
          >
            <HiOutlinePencilSquare />
          </button>
        </div>
      </div>

      {confirmation && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4">
          {confirmation}
        </div>
      )}

      {selectedMessage ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {selectedMessage.message.subject}
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>Country:</strong> {selectedMessage.message.country}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Industry:</strong> {selectedMessage.message.industry}
          </p>
          <p className="text-gray-700 mb-6">{selectedMessage.message.message}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Replies:</h3>
            {replies.length > 0 ? (
              <ul className="space-y-4">
                {replies.map((reply, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700">{reply.reply}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Sent on: {new Date(reply.date).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No replies yet.</p>
            )}
          </div>

          <textarea
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Write your reply here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow"
              onClick={handleReply}
            >
              Send Reply
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg shadow"
              onClick={closeFullMessage}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 mt-5 border min-h-60">
          <ul className="space-y-4">
            {
              messages.length ? (
                messages.map((message) => (
                  <li key={message._id} className="border-b pb-4 last:border-none flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        {message.message.subject}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {message.message.message.slice(0, 50)}...
                      </p>
                    </div>
                    <button
                      className="text-blue-500 hover:underline mt-2"
                      onClick={() => handleViewMessage(message)}
                    >
                      Read more
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No messages to show.</p>
              )
            }
          </ul>
        </div>
      )}
    </div>
  );
}


