import { View, Button, Image } from "@tarojs/components";
import { socketUrl } from "@/services/constant";
import { useEffect, useRef, useState } from "react";
import { connectSocket, SocketTask } from "@tarojs/taro";
import BmDice from "@/components/BmDice";
import classNames from "classnames";
import { useGlobalStore } from "@/zustand/index";
import styles from "./index.module.scss";

import { useShareAppMessage, getCurrentInstance } from "@tarojs/taro";
import "@/assets/iconfont/iconfont.css";

const diceEl: any = {
  1: (
    <View className={classNames([styles["face"]], styles["face-1"])}>
      <View className={styles["dots"]}>
        <View className={styles["dot"]}></View>
      </View>
    </View>
  ),
  2: (
    <View className={classNames([styles["face"]], styles["face-2"])}>
      <View className={styles["dots"]}>
        <View className={styles["dot"]}></View>
        <View className={styles["dot"]}></View>
      </View>
    </View>
  ),
  3: (
    <View className={classNames([styles["face"]], styles["face-3"])}>
      <View className={styles["dots"]}>
        <View className={styles["dot"]}></View>
        <View className={styles["dot"]}></View>
        <View className={styles["dot"]}></View>
      </View>
    </View>
  ),
  4: (
    <View className={classNames([styles["face"]], styles["face-4"])}>
      <View className={styles["dots"]}>
        <View className={styles["column"]}>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
        </View>
        <View className={styles["column"]}>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
        </View>
      </View>
    </View>
  ),
  5: (
    <View className={classNames([styles["face"]], styles["face-5"])}>
      <View className={styles["dots"]}>
        <View className={styles["column"]}>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
        </View>
        <View className={styles["dot"]}></View>
        <View className={styles["column"]}>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
        </View>
      </View>
    </View>
  ),
  6: (
    <View className={classNames([styles["face"]], styles["face-6"])}>
      <View className={styles["dots"]}>
        <View className={styles["column"]}>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
        </View>

        <View className={styles["column"]}>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
          <View className={styles["dot"]}></View>
        </View>
      </View>
    </View>
  ),
};

const GameRoom = () => {
  const { userInfo } = useGlobalStore();
  const [players, setPlayers] = useState([]);

  const dice1Ref = useRef<any>(null);
  const dice2Ref = useRef<any>(null);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const socketTaskRef = useRef<any>();

  // 连接到WebSocket服务器
  const connectWebSocket = async () => {
    // 创建WebSocket连接
    const ws: SocketTask = await connectSocket({
      url: socketUrl,
      success: () => {
        console.log("WebSocket连接已建立");
      },
      fail: (error) => {
        console.error("WebSocket连接失败:", error);
      },
    });

    // 监听WebSocket打开
    ws.onOpen(() => {
      console.log("连接上了");
      socketTaskRef.current = ws;
      console.dir(userInfo)
      // 进入页面通知其它用户
      enter();
    });

    ws.onMessage((data: any) => {
      console.log("收到消息", data);
    });
    // 监听WebSocket关闭
    ws.onClose(() => {
      // 尝试重新连接
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    });
  };

  // 组件挂载时连接WebSocket
  useEffect(() => {
    connectWebSocket();

    init();
    // 组件卸载时关闭连接
    return () => {
      if (socketTaskRef.current) {
        socketTaskRef.current.close();
      }
    };
  }, []);

  const init = () => {};

  const enter = () => {
    const payload = {
      event: "joinRoom",
      data: {
        roomId: 1,
        username: userInfo.nickName,
      },
    };
    console.dir(socketTaskRef.current.send);
    socketTaskRef.current.send({
      data: JSON.stringify(payload),
      success: () => {
        console.log("消息发送成功");
      },
      fail: (error) => {
        console.error("消息发送失败:", error);
      },
    });
  };

  useShareAppMessage(() => {
    const params: any = getCurrentInstance().router?.params;
    return {
      title: "邀请好友",
      path: `/pages/index/index?roomId=${params.roomId}&roomName=${params.roomName}`,
      imageUrl: "",
    };
  });

  const handleRollDice = () => {
    setBtnDisabled(true);
    dice1Ref.current.handleShake();
    dice2Ref.current.handleShake();
    setTimeout(() => {
      setBtnDisabled(false);
      const dice1 = dice1Ref.current.diceValue;
      const dice2 = dice2Ref.current.diceValue;

      setPlayers((prevPlayers: any) => {
        return prevPlayers.map((player: any) => {
          return {
            ...player,
            points: [...player.points, dice1, dice2],
          };
        });
      });
    }, 5100);
  };

  return (
    <View className={styles["room-container"]}>
      <View className={styles["dice-bg"]}>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
      </View>
      <View className={styles["player-container"]}>
        {players.map((player: any) => {
          return (
            <View className={styles["player-item"]} key={player.id}>
              <View className={styles["player-name"]}>{player.name}</View>
              <Image src={player.avatar} className={styles["player-avatar"]} />
              <View className={styles["point-wrapper"]}>
                {player.points.map((point: any, index: number) => {
                  return <View key={index}>{diceEl[point]}</View>;
                })}
              </View>
            </View>
          );
        })}
        <Button openType="share" className={styles["add-player"]}>
          <View
            className={classNames([
              "iconfont",
              "icon-add1",
              styles["add-icon"],
            ])}
          ></View>
          <View className={styles["add-text"]}>邀请</View>
        </Button>
      </View>

      <View className={styles["dice-container"]}>
        <View className={styles["dice-wrapper"]}>
          <BmDice ref={dice1Ref} />
          <BmDice ref={dice2Ref} />
        </View>

        <Button
          className="button-default"
          disabled={btnDisabled}
          onClick={handleRollDice}
        >
          摇一下🎲
        </Button>
      </View>
    </View>
  );
};

export default GameRoom;
