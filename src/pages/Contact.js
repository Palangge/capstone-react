import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ContactMessageList = ({ messages,fetchContactMessages }) => {

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/contact/${id}`);
      console.log('Message deleted successfully!');
      fetchContactMessages();
    } catch (error) {
      console.error('Error deleting contact message:', error);
    }
  };

  return (
    <div className="card m-auto">
      <p className="h1 text-center mt-5">CONTACT MESSAGE LIST ({messages.length})</p>
      <ul>
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message._id}>
              <Link to={`/Contact/${message._id}`}>
                <span className="border me-1">First Name: {message.firstName} </span>
                <span className="border me-1">Last Name: {message.lastName} </span>
                <span className="border me-1">Email: {message.email} </span>
                <span className="border me-1">Contact Number: {message.contactNumber} </span>
              </Link>
              <button className='btn btn-danger' onClick={() => handleDelete(message._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No Message yet</p>
        )}
      </ul>
    </div>
  );
};

export const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sState, setSState] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [contactMessage, setContactMessage] = useState(null);
  const { id } = useParams();

  const fetchIsAdmin = async () => {
    try {
      const response = await axios.get('/users/isAdmin');
      const data = response.data;
      setIsAdmin(data.message);
      localStorage.setItem("isAdmin",data.message);
    } catch (error) {
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
      console.error('Failed to fetch user status:', error);
    }
  };

  // Function to fetch the contact message by ID
  const fetchContactMessage = async (id) => {
    try {
      const response = await axios.get(`/api/contact/${id}`);
      console.log(response.data);
      setContactMessage(response.data);
    } catch (error) {
      console.error('Error fetching contact message:', error);
    }
  };

  // Function to fetch the contact message list
  const fetchContactMessages = async () => {
    try {
      const response = await axios.get('/api/contact');
      console.log(response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  useEffect(() => {
    fetchIsAdmin();
    
    if (id) {
      fetchContactMessage(id);
    }
  }, [id]);
  useEffect(()=>{
    if(isAdmin){
        fetchContactMessages();
    }
  },[isAdmin]);
  useEffect(()=>{
    fetchIsAdmin();
  },[]);

  const sendMessage = async () => {
    try {
      setSState(true);
      const firstName = document.getElementById('fName').value;
      const lastName = document.getElementById('lName').value;
      const email = document.getElementById('emailAdd').value;
      const contactNumber = document.getElementById('contactNo').value;
      const message = document.getElementById('message').value;

      const payload = {
        firstName,
        lastName,
        email,
        contactNumber,
        message,
      };
      const response = await axios.post('/api/contact', payload);
      console.log(response.data);
      setMsg('Message sent successfully!');
      setTimeout(() => {
        window.location.replace(window.location.origin);
      }, 300);
    } catch (error) {
      console.error('Error sending message:', error);
      setErr('Error sending message: '+error);
    }
    setSState(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/contact/${id}`);
      setMsg('Message deleted successfully!');
      alert(response.data);
      window.location.replace(window.location.origin+"/Contact");
    } catch (error) {
      console.error('Error deleting contact message:', error);
      setErr('Error deleting contact message: '+error);
    }
  };
  const MessageModal = () => {
    return (
        <div class="alert alert-secondary alert-dismissible fade show" role="alert">
            {msg}
            <button type="button" class="btn-close" onclick={setMsg('')} data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
  };
  const ErrorModal = () => {
    return (
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {err}
            <button type="button" class="btn-close" onclick={setErr('')} data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
  };

  if (isAdmin && id && contactMessage) {
    return (
      <div className="card m-auto">
        <pre>
          <Link to={`/Contact`}><button className='btn btn-primary'>{"<"}</button></Link>
          <p className="h1 text-center mt-5">CONTACT MESSAGE</p>
          <p>First Name: {contactMessage.firstName}</p>
          <p>Last Name: {contactMessage.lastName}</p>
          <p>Email: {contactMessage.email}</p>
          <p>Contact Number: {contactMessage.contactNumber}</p>
          <p>Message: {contactMessage.message}</p>
        </pre>
        <button className='btn btn-danger' onClick={handleDelete}>Delete</button>
      </div>
    );
  } else if (isAdmin) {
    return <ContactMessageList messages={messages} fetchContactMessages={fetchContactMessages} />;
  } else {
    return (
      <>
        <card class="card m-auto">
          <p class="h1 text-center mt-5">CONTACT FORM</p>

          <section>
            <form id="contact-form" class="container">
              <div class="mb-3">
                <label for="fName" class="form-label">
                  First Name
                </label>
                <input type="text" class="form-control" id="fName" placeholder="Enter your First Name" required />
              </div>

              <div class="mb-3">
                <label for="lName" class="form-label">
                  Last Name
                </label>
                <input type="text" class="form-control" id="lName" placeholder="Enter your Last Name" required />
              </div>

              <div class="mb-3">
                <label for="emailAdd" class="form-label">
                  Email address
                </label>
                <input type="email" class="form-control" id="emailAdd" placeholder="Enter your Email Address" required />
              </div>

              <div class="mb-3">
                <label for="contactNo" class="form-label">
                  Contact Number
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="contactNo"
                  placeholder="Enter your Contact Number 0910-123-4567"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="message" class="form-label">
                  Please state your detailed message here
                </label>
                <textarea class="form-control" id="message" rows="3"></textarea>
              </div>
              {err && <ErrorModal />}
              {msg && <MessageModal />}
              <button type="button" class="btn btn-primary" disabled={sState} onClick={sendMessage}>
                Submit
              </button>
              <button type="reset" class="btn btn-secondary">
                Clear
              </button>
            </form>

            <div
              id="contactToast"
              class="toast position-fixed top-0 start-50 translate-middle-x"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div class="toast-body">
                <span id="contactToastMsg"></span>
              </div>
            </div>

            <socials1 class="col-sm-4 pt-3 pb-3 mt-3">
              <div class="card ms-5 me-5 pt-3 pb-3">
                <div class="text-center pb-3">You can follow us on our social media.</div>

                <div class="text-center align-items-center pb-2">
                  <p>
                    <a
                      href="https://www.facebook.com/kayneflowers22?mibextid=ZbWKwL"
                      rel="noopener"
                      aria-label="facebook"
                      class="fa-brands fa-facebook fa-3x fa-fw"
                    ></a>
                    <a
                      href="https://instagram.com/flowerskayne?igshid=ZDdkNTZiNTM="
                      rel="noopener"
                      aria-label="instagram"
                      class="fa-brands fa-instagram fa-3x fa-fw"
                    ></a>
                    <a
                      href="https://github.com/kayneflowers"
                      rel="noopener"
                      aria-label="github"
                      class="fa-brands fa-github fa-3x fa-fw"
                    ></a>
                  </p>
                </div>

                <div class="text-center">
                  Email Address:
                  <a href="mailto:kayeregine22@gmail.com" class="contact-link">
                    kayeregine22@gmail.com
                  </a>
                  <span>|</span>
                  Telephone Number:
                  <a href="tel:01234567" class="contact-link">
                    0123-4567
                  </a>
                </div>
              </div>
            </socials1>
          </section>
        </card>
      </>
    );
  }
};
