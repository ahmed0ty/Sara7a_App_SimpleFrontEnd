import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./sendMessage.css";
import sara7aImg from "../assets/sara7a.jpeg";

function SendMessage() {

  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const emojis = ["😢","😭","😘","😍","🙂","🤣","😂","😁","😜","🙈","💋","👋","😷","😡","💩","😲","😎","❤️","🌹"];

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `https://sara7a-application.onrender.com/api/user/public/${id}`
        );
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [id]);

  const formatLastSeen = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      alert("اكتب رسالة أولا");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `https://sara7a-application.onrender.com/api/messages/${id}/send-message`,
        { content: message }
      );
      setSuccess(true);
      setMessage("");
    } catch (err) {
      console.log(err.response?.data || err);
      alert("حصل خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="successPage">
        <div className="successCard">
          <div className="checkmark">✔</div>
          <h2>تم إرسال الرسالة</h2>
          <p>تم إرسال رسالتك بنجاح بشكل سري</p>
          <button onClick={() => setSuccess(false)}>إرسال رسالة أخرى</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">

        {/* Profile Section with Loading */}
        {!user ? (
          <p>جاري تحميل البيانات...</p>
        ) : (
          <div className="profile">
            <img src={sara7aImg} alt="profile"/>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>آخر ظهور : {formatLastSeen(user.lastSeen)}</p>
          </div>
        )}

        <textarea
          placeholder="هل لديك شيء تريد قوله بدون أن يعرفك؟"
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="counter">
          {500 - message.length} الحروف المتبقية
        </div>

        <div className="anonymous">
          <span>بشكل سري :</span>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
        </div>

        <div className="emojiBox">
          {emojis.map((e, index) => (
            <span key={index} onClick={() => addEmoji(e)}>{e}</span>
          ))}
        </div>

        <button
          className="sendBtn"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "إرسال الآن"}
        </button>

      </div>
    </div>
  );
}

export default SendMessage;