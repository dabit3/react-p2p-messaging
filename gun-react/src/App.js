import { useEffect, useState, useReducer } from 'react'
import logo from './logo.svg';
import './App.css';
import Gun from 'gun/gun'

const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})

const initialState = {
  messages: []
}

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
}

function App() {
  const [message, setMessage] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const messages = gun.get('messages')
    console.log('messages: ', messages)
    messages.map().on(function (m) {
      dispatch({
        message: m.message,
        createdAt: m.createdAt
      })
    })
  }, [])
  
  function saveMessage() {
    const messages = gun.get('messages')
    messages.set({ message, createdAt: Date.now() })
    setMessage('')
  } 
  function onChange(e) {
    setMessage(e.target.value)
  }
  console.log('messages:', state.messages)
  return (
    <div style={{ padding: 30 }}>
        <input
          onChange={onChange}
          placeholder="Message"
          value={message}
        />
        <button onClick={saveMessage}>Save Message</button>
        {
          state.messages.map(message => (
            <>
              <h2>{message.message}</h2>
              <p>{message.createdAt}</p>
            </>
          ))
        }
    </div>
  );
}

export default App;
