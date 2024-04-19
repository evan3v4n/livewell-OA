"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Ensure correct import
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
export default function ChatRoom({params}) {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { userInfo } = useAuth();
    const threadID = params.threadID;
    
    const role = userInfo.isDoctor ? 'Doctor' : 'Patient';


    useEffect(() => {
        if (!threadID) return;

        const messagesRef = query(collection(db, 'threads', threadID, 'messages'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(messagesRef, snapshot => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
    }, [threadID]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, 'threads', threadID, 'messages'), {
            text: newMessage,
            createdAt: serverTimestamp(),
            senderId: userInfo.uid, // Assuming you have currentUser setup
            senderUsername: userInfo.username,
            senderRole: role,
        });

        setNewMessage('');
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const imageRef = storageRef(storage, `chat-images/${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);
    
        // Create a message with the image URL
        await addDoc(collection(db, 'threads', threadID, 'messages'), {
            imageUrl,
            createdAt: serverTimestamp(),
            senderId: userInfo.uid, // Assuming you have a user setup
            senderUsername: userInfo.username, // Modify as needed to use actual user data
            senderRole: role, // Modify as needed
        });
    
        // Clear the file input after upload
        event.target.value = null;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen">
            <h1 className="text-2xl font-semibold text-center text-blue-800 mb-4">Chat Room</h1>
            <ul className="flex-grow overflow-y-auto mb-4">
                {messages.map(message => (
                    <li key={message.id} className="bg-white p-2 rounded shadow mb-2">
                        <p className="text-sm font-medium text-gray-600">
                            {message.senderUsername} ({message.senderRole})
                        </p>
                        {message.imageUrl ? (
                            <img src={message.imageUrl} alt="Sent image" className="max-w-full h-auto rounded" />
                        ) : (
                            <p className="text-gray-800">{message.text}</p>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={sendMessage} className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border rounded-l outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="p-2"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-r">
                    Send
                </button>
            </form>
        </div>
    );
    
    
}