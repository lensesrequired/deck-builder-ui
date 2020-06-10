import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [date, setDate] = useState(null);
  useEffect(() => {
    axios.get('/time').then(async res => {
      const { data } = res;
      setDate(data.time);
    });
    axios.get('/photo').then(function(response) {
      let responseBlob = new Blob([response.data], { type: 'image/png' });
      let reader = new window.FileReader();
      reader.readAsDataURL(responseBlob);
      reader.onload = function() {
        let imageDataUrl = reader.result;
        console.log(imageDataUrl);
      };
    });
  }, []);
  return (
    <main>
      <h1>Create React App + Go API</h1>
      <h2>
        Deployed with{ ' ' }
        <a
          href="https://vercel.com/docs"
          target="_blank"
          rel="noreferrer noopener"
        >
          Vercel
        </a>
        !
      </h2>
      <p>
        <a
          href="https://github.com/vercel/vercel/tree/master/examples/create-react-app"
          target="_blank"
          rel="noreferrer noopener"
        >
          This project
        </a>{ ' ' }
        was bootstrapped with{ ' ' }
        <a href="https://facebook.github.io/create-react-app/">
          Create React App
        </a>{ ' ' }
        and contains three directories, <code>/public</code> for static assets,{ ' ' }
        <code>/src</code> for components and content, and <code>/api</code>{ ' ' }
        which contains a serverless <a href="https://golang.org/">Go</a>{ ' ' }
        function. See{ ' ' }
        <a href="/api/date">
          <code>api/date</code> for the Date API with Go
        </a>
        .
      </p>
      <br/>
      <h2>The date according to Go is:</h2>
      <p>{ date ? date : 'Loading date...' }</p>
    </main>
  );
}

export default App;
