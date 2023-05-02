import './Message.css';

import { useState, useEffect } from 'react';

// utils
import bus from '../../utils/bus';

const Message = () => {

    const [visibility, setVisibility] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

        bus.addListener('flash', ({message, type}) => {
            setVisibility(true);
            setMessage(message);
            setType(type);

            setTimeout(() => {
                setVisibility(false);
            },6000);
        })

    },[])

  return (
    visibility && (
        <div className={`message ${type}`}>{message}</div>
    )
  )
}

export default Message