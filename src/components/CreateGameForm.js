import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Container, Form, Button } from 'react-bootstrap'

import AccordionMenu from './subcomponent/AccordionMenu';
import socket from '../socket.js';

import '../assets/CreateGameForm.css';

const CreateGameForm = () => {
  
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle receiving the response for create room and join room
  useEffect(() => {
    socket.on('createRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        console.error(response.error);
      }
    });

    socket.on('joinRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Game room does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    });

    return () => {
      socket.off('createRoomResponse');
      socket.off('joinRoomResponse');
    };
  });

  const GameTitle = () => {
    return (
      <motion.div
        className="landing-title"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        God of Hellfire
      </motion.div>
    )
  }

  // Handle the response for creating a room
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    socket.emit('createGameRoom', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Failed to create a lobby.');
        console.error(response.error);
      }
    });
  };


  // Handle the response for joining a room
  const handleGameCode = async (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    if (gameID.trim() === '') {
      setErrorMessage('Please enter a valid lobby ID.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    socket.emit('joinGameRoom', ({ gameID: gameID }), (response) => {
      if (response.success) {
        navigate(`/waiting/${gameID}`, { state: name });
      } else {
        setErrorMessage('Lobby ID does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    })
  };

  return (
    <Container className="landing-container vh-100 d-flex align-items-center justify-content-center">
      {GameTitle()}
      <motion.div
        initial={{ y: 10, opacity: 0}}
        animate={{ y: 0, opacity: 1}}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      > 

        <Form.Group className="d-flex align-items-center gap-2 mb-3">
          <Form.Label className="lobby-form-label text-nowrap mt-2">
            Name:
          </Form.Label>
          <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} className="lobby-form-input" id="name" placeholder="e.g., Elyira" />
        </Form.Group>

        <Container className="lobby-forms-container gap-4">
          <Form onSubmit={handleSubmit}>
            <Button className="btn host-form-button" type="submit">
              Host
            </Button>
          </Form>

          <Form onSubmit={handleGameCode}>
            <Form.Group className="d-flex align-items-center gap-2 mb-2">
              <Form.Label className="lobby-form-label text-nowrap mt-2">
                Lobby ID:
              </Form.Label>
              <Form.Control type="text" value={gameID} onChange={(event) => setGameID(event.target.value)} className="lobby-form-input" id="gameID" placeholder="e.g., zdh3fj" />
            </Form.Group>

            <Button className="btn join-form-button" type="submit">
              Join
            </Button>
          </Form>
        </Container>

        {showErrorMessage && (<div className="notification-alert notification-alert--error">{errorMessage}</div>)}
      </motion.div>
    </Container>
  );
}

export default CreateGameForm;
