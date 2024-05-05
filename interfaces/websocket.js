import { useEffect, useState } from 'react';
import environment from './environment';
import { useStorageState } from './storage';

function objectToUrlParams(obj) {
    const params = [];
  
    for (const key in obj) {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    }
  
    return params.join('&');
  }

export const generateUrl = (path, params) => {
  // const parts = [`${environment.wsHost}${path}?`];

  // if (params && Object.keys(params).length) {
  //   parts.push(objectToUrlParams(params));
  // }

  // return parts.join('');
  return `${environment.wsHost}${path}?${objectToUrlParams(params)}`;;
}

export function useWebSocket(path, params={}) {
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState(null);
    const [webSocket, setWebSocket] = useState(null);    
    const [[isLoading, session]] = useStorageState('session');
  

    useEffect(() => {       
        if (!session) {
            return;
        }
        const url = generateUrl(path, {...params, token: session});
        console.log('URL', url);
        const uri = `${url}&token=${session}`;
        const socket = new WebSocket(uri);
        
        socket.onclose = () => setConnected(false);;
        socket.onmessage = (event) => setMessage(JSON.parse(event.data));
        socket.onerror = (error) => console.error('WebSocket error:', error);
        socket.onopen = () => setConnected(true);
    
        setWebSocket(socket);

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [session]);

  const sendMessage = (data) => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(data));
    }
  };

  return { connected, message, sendMessage };
}
