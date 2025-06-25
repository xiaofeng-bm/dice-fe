import { connectSocket, SocketTask, useRouter } from "@tarojs/taro";
import { useRef } from "react";
import { MessageProps, PayloadProps } from "../config";

interface WebSocketProps {
  onMessage: (message: MessageProps) => void;
}
const HEARTBEAT_INTERVAL = 10000 // 28秒心跳间隔

const socketUrl = process.env.TARO_APP_SOCKETURL || "wss://slyai.top/ws";
export const useWebSocket = ({ onMessage }: WebSocketProps) => {
  const { params } = useRouter();
  const socketTaskRef = useRef<any>();
  
  const userInfo = useRef<any>(null);

  const heartbeatInterval = useRef<any>(null);

  const concateSocket = async (userData: any) => {
    userInfo.current = userData;
    // 创建WebSocket连接
    const ws: SocketTask = await connectSocket({
      url: socketUrl,
      success: () => {
        // todu
      },
      fail: (error) => {
        console.error("WebSocket连接失败:", error);
      },
    });

    // 监听WebSocket打开
    ws.onOpen(() => {
      socketTaskRef.current = ws;
      enter();

      heartBeat();
    });

    ws.onMessage((data: any) => {
      const message = JSON.parse(data.data);
      console.log("收到消息:", message);

      // 处理心跳响应
      if (message.event === "heartbeat") {
        const now = new Date();
        return;
      }
      onMessage(message);
    });
    // 监听WebSocket关闭
    ws.onClose(() => {
      // 尝试重新连接
      setTimeout(() => {
        // connectWebSocket();
      }, 3000);
    });
  };

  const sendMessage = (payload: PayloadProps) => {
    socketTaskRef.current.send({
      data: JSON.stringify(payload),
      success: () => {
        // todu
      },
      fail: (error) => {
        console.error("消息发送失败:", error);
      },
    });
  };

  const enter = () => {
    
    const payload = {
      event: "joinRoom",
      data: {
        roomId: params.roomId,
        username: userInfo.current?.username,
        userId: userInfo.current?.id,
      },
    };
    socketTaskRef.current.send({
      data: JSON.stringify(payload),
      success: () => {
        // todu
      },
      fail: (error) => {
        console.error("消息发送失败:", error);
      },
    });
  };

  /**
   * socket心跳检测
   */
  const heartBeat = () => {
    stopHeartBeat();
    heartbeatInterval.current = setInterval(() => {
      const payload = {
        event: "heartbeat",
        data: {
          roomId: params.roomId,
          userId: userInfo.current?.id,
        },
      };
      sendMessage(payload);
    }, HEARTBEAT_INTERVAL);
  };

  const stopHeartBeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  return {
    concateSocket,
    sendMessage,
  };
};
