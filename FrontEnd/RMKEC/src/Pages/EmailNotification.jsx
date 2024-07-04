import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import './EmailNotification.css';

const EmailNotification = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [senderlist, setSenderList] = useState([
    { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false },
    { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false },
    { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false }
  ]);

  const textAreaRef = useRef(null);


  const adjustTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);


  const handleCheck = (id) => {
    const updatedList = senderlist.map(member =>
      member.id === id ? { ...member, checked: !member.checked } : member
    );
    setSenderList(updatedList);
  };

  const handleSendEmail = async () => {
    try {
      let selectedEmails = senderlist.filter(member => member.checked).map(member => member.text);

      if (to.trim() !== '') {
        
        const additionalEmails = to.split(',').map(email => email.trim());
        selectedEmails = [...selectedEmails, ...additionalEmails];
      }

      console.log(selectedEmails);
      const response = await axios.post('http://localhost:3000/mail/send', {
        to: selectedEmails,
        subject: subject,
        desc: text
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="email-notification">
      <h3>Subject:</h3>
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <h3>Body:</h3>
      <textarea  style={{resize:'none',minHeight: '90px'}} ref={textAreaRef} placeholder="Email Body" value={text} onChange={(e) => setText(e.target.value)} />
      <h3>Recipient Emails:</h3>
      <ul>
        {senderlist.map(item => (
          <li key={item.id}>
            <label>
              
              <input type="checkbox" class="sc-gJwTLC ikxBAC" checked={item.checked}
                onChange={() => handleCheck(item.id)}/>

              {item.text}
            </label>
          </li>
        ))}
      </ul>
      <input type="email" placeholder="Other Recipient Emails (comma-separated)" value={to} onChange={(e) => setTo(e.target.value)} />
      <div className="send-button-container">
      <button onClick={handleSendEmail}>Send Email</button>
      </div>
    </div>
  );
};

export default EmailNotification;
