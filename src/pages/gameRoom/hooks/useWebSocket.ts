import { connectSocket, SocketTask, useRouter } from "@tarojs/taro";
import { useRef } from "react";
import { useGlobalStore } from "@/zustand/index";
import { socketUrl } from "@/services/constant";
import { MessageProps, PayloadProps } from "../config";

interface WebSocketProps {
  onMessage: (message: MessageProps) => void;
}

export const useWebSocket = ({ onMessage }: WebSocketProps) => {
  const { params } = useRouter();
  const socketTaskRef = useRef<any>();
  const { userInfo } = useGlobalStore();

  const concateSocket = async () => {
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
    });

    ws.onMessage((data: any) => {
      const message = JSON.parse(data.data);
      console.log("message", message);
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
        username: userInfo.username,
        userId: userInfo.id,
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

  return {
    concateSocket,
    sendMessage
  };
};
