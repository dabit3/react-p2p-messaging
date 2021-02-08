import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'

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

export default function App() {
  const [formState, setForm] = useState({
    name: '', message: ''
  })
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const messages = gun.get('messages')
    messages.map().on(m => {
      dispatch({
        message: m.message,
        name: m.name,
        createdAt: m.createdAt
      })
    })
  }, [])
  
  function saveMessage() {
    const messages = gun.get('messages')
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now()
    })
    setForm({
      name: '', message: ''
    })
  } 
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value  })
  }
  console.log('formState: ', formState)
  return (
    <div style={{ padding: 30 }}>
        <input
          onChange={onChange}
          placeholder="Name"
          name="name"
          value={formState.name}
        />
        <input
          onChange={onChange}
          placeholder="Message"
          name="message"
          value={formState.message}
        />
        <button onClick={saveMessage}>Send Message</button>
        {
          state.messages.map(message => (
            <div key={message.createdAt}>
              <h2>{message.message}</h2>
              <h3>{message.name}</h3>
              <p>{message.createdAt}</p>
            </div>
          ))
        }
    </div>
  );
}