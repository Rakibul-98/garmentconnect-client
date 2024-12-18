import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Login from "./Pages/Home/Login/Login";
import Register from "./Pages/Home/Register/Register";
import Inbox from "./Pages/Inbox/Inbox";
import Navbar from "./Pages/Navbar/Navbar";
import Compose from "./Pages/Inbox/Compose/Compose";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import { auth } from "./firebase";
import SentReplies from "./Pages/Inbox/SentReplies/SentReplies";
import Footer from "./Pages/footer/Footer";
import Payment from "./Pages/Payments/Payment";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="text-xs sm:text-sm md:text-base">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sent-replies" element={<SentReplies />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment" element={<Payment setPaymentStatus={setPaymentStatus} />} />
        <Route
          path="/inbox"
          element={
            <PrivateRoute user={user}>
              <Inbox />
            </PrivateRoute>
          }
        />
        <Route
          path="/compose"
          element={
            <PrivateRoute user={user}>
              <Compose paymentStatus={paymentStatus} />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
