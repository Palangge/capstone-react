//import logo from './logo.svg';
import './App.css';
import React from 'react';
import {Routess} from './routes/Routess';
import ReactDom from 'react-dom';
import {Header} from "./body/Header";
import {Footer} from "./body/Footer";

function App() {
  return (
  <>
    {ReactDom.createPortal(<Header />,document.getElementById('outer-world-header'))}
    <Routess/>
    {ReactDom.createPortal(<Footer />,document.getElementById('outer-world-footer'))}
  </>);
}

export default App;
