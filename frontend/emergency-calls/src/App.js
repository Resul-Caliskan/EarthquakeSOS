import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ListComponent from './components/listComponent';

function App() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('API_URL_HERE') // API URL'ini buraya ekleyin
      .then(response => {
        setCalls(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="App">
      <h1>Acil Durum Çağrıları</h1>
      <ListComponent/>
      <ul>
        {calls.map(call => (
          <li key={call.id}>
            <h2>{call.title}</h2>
            <p>{call.description}</p>
            <p><strong>Time:</strong> {call.time}</p>
            {call.audioUrl && (
              <audio controls>
                <source src={call.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
