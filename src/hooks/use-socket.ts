import { API_BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(namespace = "/realtime") {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const url = `${API_BASE_URL}${namespace}`;

    const s = io(url, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // eslint-disable-next-line no-console
    s.on("connect", () => console.log("✅ WS connected", s.id));
    s.on("connect_error", (err) => console.error("❌ connect_error", err));
    s.on("disconnect", (reason) => console.warn("⚠️ disconnect", reason));

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [namespace]);

  return socket; // can be undefined the first render
}
