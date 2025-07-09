import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import {ThemeProvider} from './ThemeContext'
import SeedTransactions from './components/SeedTransactions'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <HashRouter>
      <Routes>
        {/* Default redirect from / to /app */}
        <Route path="/" element={<Navigate to="/app" />} />
        <Route path="/seed" element={<SeedTransactions />} />
        <Route path="/app" element={<App />} />
       
      </Routes>
    </HashRouter>
  </ThemeProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
