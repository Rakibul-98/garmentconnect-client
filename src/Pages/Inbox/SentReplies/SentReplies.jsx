import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { PiMailboxBold } from "react-icons/pi";
import { Link } from "react-router";

export default function SentReplies() {
    const auth = getAuth();
    const [groupedReplies, setGroupedReplies] = useState({});
    const currentUser = auth.currentUser?.email;
    const [newReply, setNewReply] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const messagesResponse = await fetch("https://y-five-ashen.vercel.app/messages");
                const messagesData = await messagesResponse.json();

                const userMessages = messagesData.filter(
                    (message) => message.message.senderEmail === currentUser
                );

                const messageIds = userMessages.map((message) => message._id);

                const repliesResponse = await fetch("https://y-five-ashen.vercel.app/replies");
                const repliesData = await repliesResponse.json();

                const grouped = messageIds.reduce((acc, messageId) => {
                    acc[messageId] = repliesData.filter(
                        (reply) => reply.messageId === messageId
                    );
                    return acc;
                }, {});

                setGroupedReplies(grouped);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentUser]);

    const handleReplySubmit = (messageId) => {
        if (!newReply.trim()) {
            alert("Reply cannot be empty!");
            return;
        }

        console.log(`Reply to message ID ${messageId}: ${newReply}`);

        setNewReply("");
        alert("Your reply has been sent!");
    };

    return (
        <div className="mt-20 mx-auto max-w-4xl p-4 mb-10 lg:mb-0">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Replies</h1>
                
                    <Link className="text-4xl text-blue-500 hover:text-blue-600" to="/inbox"><PiMailboxBold /></Link>
            </div>
            <div className="bg-white shadow rounded-lg p-4 border mt-5 min-h-60">
                {Object.keys(groupedReplies).length > 0 ? (
                    Object.entries(groupedReplies).map(([messageId, replies]) => (
                        <div key={messageId} className="mb-8">
                            <h2 className="text-xl font-bold text-gray-700">
                                Message ID: {messageId}
                            </h2>
                            <ul className="space-y-4 mt-4">
                                {
                                    replies.length ? (
                                        replies.map((reply) => (
                                            <li
                                                key={reply._id}
                                                className="border-b pb-4 last:border-none"
                                            >
                                                <p className="text-lg font-semibold text-gray-700">
                                                    {reply.reply}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Replied on: {new Date(reply.date).toLocaleString()}
                                                </p>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No replies found for this message.</p>
                                    )
                                }
                            </ul>
                            <textarea
                                className="w-full p-2 border rounded-lg mt-4"
                                placeholder="Write your reply here..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow mt-2"
                                onClick={() => handleReplySubmit(messageId)}
                            >
                                Send Reply
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No replies available for your messages.</p>
                )}
            </div>
        </div>
    );
}
