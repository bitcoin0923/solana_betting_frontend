import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import styled from 'styled-components';

import Footer from '../components/footer';
import Header from '../components/header';
import Dashboard from './dashboard';
import Featured from './featured';
import PageWrapper from './page_wrapper';

import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  position: relative;
  color: ${({ theme }) => theme.colors.text1};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const AppRouter = () => (
  <>
    <Header />
    <Container>
      <Routes>
        <Route element={<PageWrapper component={<Dashboard />} />} path="/dashboard" />
        <Route element={<PageWrapper component={<div />} />} path="/upcoming" />
        <Route element={<PageWrapper component={<div />} />} path="/brawl" />
        <Route element={<PageWrapper component={<Featured />} grayscale />} path="/" />
      </Routes>
    </Container>
    <Footer />
    <ToastContainer />
  </>
);

export default AppRouter;
