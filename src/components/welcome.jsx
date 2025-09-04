
import React, { useState, useEffect } from 'react';
import { useAuthCheck } from '../utils/Auth';
import styled, { keyframes } from 'styled-components';
import digineouslogo from '../assets/images/digineous2.png'
import { Typography } from '@mui/material';

const pulse = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(52, 152, 219, 0));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(52, 152, 219, 0.5));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(52, 152, 219, 0));
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Poppins', sans-serif;
  color: #2c3e50;
`;

const Logo = styled.div`
  margin-bottom: 2rem;
  animation: ${pulse} 3s ease-in-out infinite;

  img {
    max-width: 200px;
    height: auto;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 1s ease-out 0.3s backwards;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin-top: 0.5rem;
  animation: ${fadeIn} 1s ease-out 0.6s backwards;
`;

const DateTime = styled.div`
  font-size: 1.2rem;
  margin-top: 2rem;
  animation: ${fadeIn} 1s ease-out 0.9s backwards;
`;

export default function Welcome() {
  useAuthCheck();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <WelcomeContainer>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#32053d",
          marginBottom: 2,
          textShadow: "0 3px 6px rgba(0,0,0,0.1)",
          letterSpacing: '0.05em',
          textAlign: "center",
        }}
      >
        Welcome To <br />
        Manufacturing Execution System
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#555",
          marginBottom: 4,
          fontWeight: 300,
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        Digitize shop floor operations to track OEE, CBM, and EMS data.
      </Typography>
    </WelcomeContainer>
  );
}