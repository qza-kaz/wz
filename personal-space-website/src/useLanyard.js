import { useEffect, useState } from "react";

const LANYARD_SOCKET = "wss://api.lanyard.rest/socket";

export function useLanyard(userId) {
  const [data, setData] = useState(null);
  const [connection, setConnection] = useState("connecting");

  useEffect(() => {
    if (!userId) return;
    let socket;
    let heartbeat;
    let reconnect;
    let closedByEffect = false;
    let retry = 0;

    const connect = () => {
      if (closedByEffect) return;
      setConnection("connecting");
      socket = new WebSocket(LANYARD_SOCKET);

      socket.onopen = () => {
        retry = 0;
        setConnection("connected");
      };

      socket.onmessage = (event) => {
        let message;
        try { message = JSON.parse(event.data); } catch { return; }

        if (message.op === 1) {
          // Lanyard HELLO: start heartbeat and subscribe to this Discord user.
          heartbeat = window.setInterval(() => {
            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, message.d.heartbeat_interval);
          socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        }

        if (message.op === 0 && message.d) {
          setData(message.d);
        }
      };

      socket.onerror = () => setConnection("error");
      socket.onclose = () => {
        if (heartbeat) window.clearInterval(heartbeat);
        if (closedByEffect) return;
        setConnection("reconnecting");
        retry += 1;
        reconnect = window.setTimeout(connect, Math.min(1000 * retry, 10000));
      };
    };

    connect();
    return () => {
      closedByEffect = true;
      if (heartbeat) window.clearInterval(heartbeat);
      if (reconnect) window.clearTimeout(reconnect);
      if (socket && socket.readyState <= WebSocket.OPEN) socket.close();
    };
  }, [userId]);

  return { data, connection };
}