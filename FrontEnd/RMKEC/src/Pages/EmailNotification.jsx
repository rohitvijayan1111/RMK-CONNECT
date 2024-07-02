import React, { useState } from 'react';
import axios from 'axios';

const EmailNotification = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const handleSendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3000/mail/send', {to:to,subject: subject,desc:text });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending emailss:', error);
    }
  };

  return (
    <div>
      <input type="email" placeholder="Recipient Email" value={to} onChange={(e) => setTo(e.target.value)} />
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Email Body" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default EmailNotification;
