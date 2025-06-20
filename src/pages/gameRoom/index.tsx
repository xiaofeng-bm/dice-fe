import { postEnterRoom, postLeaveRoom } from "@/services/game";
import { postLogin } from "@/services/user";
import { View, Button, Image } from "@tarojs/components";

import {
  useRouter,
  showToast,
  useShareAppMessage,
  login,
  setNavigationBarTitle,
  navigateTo,
  useUnload,
  useDidShow,
  useDidHide,
} from "@tarojs/taro";
import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";

import { useGlobalStore } from "@/zustand/index";
import BmButton from "@/components/BmButton";
import BmDice from "@/components/BmDice";
import { AtMessage } from "taro-ui";
import {
  MessageData,
  MessageProps,
  RoomInfo,
  stateMap,
  diceEl,
} from "./config";

// css
import "@/assets/iconfont/iconfont.css";
import styles from "./index.module.scss";
import { useWebSocket } from "./hooks/useWebSocket";

const GameRoom = () => {
  const { updateOpenid, updateUserInfo } = useGlobalStore();
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  const [btnDisabled, setBtnDisabled] = useState(true);

  const [userInfo, setUserInfo] = useState<any>(null);

  const dice1Ref = useRef<any>(null);
  const dice2Ref = useRef<any>(null);

  const { params } = useRouter();

  useShareAppMessage(() => {
    console.log("触发分享");
    // 点击分享触发的回调
    return {
      title: `${userInfo?.username}邀请你加入房间`,
      path: `/pages/gameRoom/index?roomId=${roomInfo?.roomId}&from=share`,
    };
  });

  const unMount = () => {
    console.log("unMount");
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (dice1Ref.current?.resetDice) {
      dice1Ref.current.resetDice();
    }
    if (dice2Ref.current?.resetDice) {
      dice2Ref.current.resetDice();
    }

    // 发送离开房间的消息
    const payload = {
      event: "leaveRoom",
      data: {
        roomId: params?.roomId,
        userId: userInfo?.id,
        username: userInfo?.username,
      },
    };
    sendMessage(payload);
  };

  useDidShow(() => {
    init();
    setNavigationBarTitle({
      title: `[${params.roomId}]号房间`,
    });
  });

  useUnload(unMount);
  useDidHide(unMount);

  const init = async () => {
    const userData: any = await getUserInfo();
    await handleEnterRoom(userData?.id, params.roomId!);
    concateSocket(userData);
  };

  const getUserInfo = async () => {
    return new Promise((resolve, reject) => {
      try {
        login({
          success: async ({ code }) => {
            updateOpenid(code);
            let res = await postLogin({ code });
            if (res.code === 0) {
              const userData = res.data.result;
              updateUserInfo(userData);
              if (userData.username && userData.headPic) {
                setUserInfo(userData);
                resolve(userData);
              } else {
                navigateTo({
                  url: `/pages/index/index?roomId=${params?.roomId}&from=gameRoom`,
                });
              }
            } else {
              reject(new Error("获取用户信息失败"));
            }
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  const handleEnterRoom = async (userId: number, roomId: string) => {
    try {
      let res = await postEnterRoom({
        userId: userId,
        roomId: Number(roomId),
      });
      if (res.code === 0) {
        res.data.players = res.data.players.map((item: any, index: number) => ({
          ...item,
          points: [],
          isOwner: index === 0,
          status: "wait",
        }));

        setRoomInfo(res.data);
      }
    } catch (error) {
      console.error("进入房间失败，请重新尝试", error);
    }
  };

  const expandRoomInfo = useMemo(() => {
    if (roomInfo) {
      // 房主信息
      const ownerInfo = roomInfo.players[0];
      // 房间是否满员
      const fullHoust = roomInfo.players.length >= roomInfo.playerLimit;
      // 是否全员已准备
      const allReady = roomInfo.players
        .filter((_: any, index: number) => index !== 0)
        .every((item: any) => item.status === "ready");

      // 是否游戏结束
      const finished = roomInfo.players.every(
        (item: any) => item.status === "finished"
      );
      // 当前房间玩家信息
      const curPlayer = roomInfo.players.find(
        (item: any) => item.id === userInfo?.id
      );

      // if (finished) {
      //   const winner = roomInfo.players.reduce((prev: any, cur: any) => {
      //     if (prev.score > cur.score) {
      //       return prev;
      //     }
      //     return cur;
      //   });
      //   console.log("winner", winner);
      // }
      return {
        ownerInfo,
        fullHoust,
        allReady,
        finished,
        curPlayer,
      };
    }
  }, [userInfo, roomInfo]);

  const handleStart = async () => {
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any) => {
          if (item.id === userInfo?.id) {
            return {
              ...item,
              status: "begin",
            };
          }
          return item;
        }),
      };
    });

    const payload = {
      event: "begin",
      data: {
        roomId: params?.roomId,
      },
    };
    sendMessage(payload);
  };

  const handleReady = async (status: string) => {
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any) => {
          if (item.id === userInfo?.id) {
            return {
              ...item,
              status: status,
            };
          }
          return item;
        }),
      };
    });

    const payload = {
      event: "ready",
      data: {
        roomId: params?.roomId,
        userId: userInfo?.id,
        status: status,
      },
    };
    sendMessage(payload);
  };

  // 用于存储游戏计时器的引用
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRollDice = () => {
    // 清除可能存在的先前计时器
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
      gameTimerRef.current = null;
    }

    setBtnDisabled(true);
    // 重置并摇动骰子
    if (dice1Ref.current) {
      dice1Ref.current.resetDice?.(); // 调用新增的重置函数
      dice1Ref.current.handleShake();
    }
    if (dice2Ref.current) {
      dice2Ref.current.resetDice?.(); // 调用新增的重置函数
      dice2Ref.current.handleShake();
    }

    // 设置新的计时器并存储引用
    gameTimerRef.current = setTimeout(() => {
      const dice1 = dice1Ref.current?.diceValue;
      const dice2 = dice2Ref.current?.diceValue;

      const points = dice2Ref.current ? [dice1, dice2] : [dice1];
      const payload = {
        event: "finish",
        data: {
          roomId: params.roomId,
          userId: userInfo?.id,
          points: points,
          score: points.reduce((acc: number, cur: number) => acc + cur, 0),
        },
      };
      sendMessage(payload);
      gameTimerRef.current = null;
    }, 5100);
  };

  const btnEle = () => {
    if (expandRoomInfo) {
      if (btnDisabled) {
        if (expandRoomInfo.curPlayer?.isOwner) {
          if (expandRoomInfo.finished) {
            return (
              <BmButton type="primary" onClick={handleAgain}>
                再来一局
              </BmButton>
            );
          } else {
            return (
              <BmButton
                type="primary"
                disabled={expandRoomInfo.allReady === false}
                onClick={handleStart}
              >
                开始对局
              </BmButton>
            );
          }
        } else {
          console.log("expandRoomInfo.curPlayer", expandRoomInfo.curPlayer);
          if (
            expandRoomInfo.curPlayer?.status === "ready" ||
            expandRoomInfo.curPlayer?.status === "wait"
          ) {
            return (
              <BmButton
                className="button-default"
                onClick={() => {
                  if (expandRoomInfo.curPlayer?.status === "ready") {
                    handleReady("wait");
                  } else {
                    handleReady("ready");
                  }
                }}
              >
                {expandRoomInfo.curPlayer?.status === "ready"
                  ? "取消准备"
                  : "准备"}
              </BmButton>
            );
          }
        }
      } else {
        return (
          <BmButton className="button-default" onClick={handleRollDice}>
            摇一下🎲
          </BmButton>
        );
      }
    }
  };

  const handleAgain = async () => {
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any) => {
          return {
            ...item,
            points: [],
            score: null,
            status: "wait",
          };
        }),
      };
    });
    const payload = {
      event: "gameAgain",
      data: {
        roomInfo: roomInfo,
      },
    };
    sendMessage(payload);
  };

  // ---------------------------------------------- message event ------------------------------------------------
  const handleOnMessage = (message: MessageProps) => {
    console.log("message", message);
    switch (message.data.type) {
      case "joinRoom":
        joinRoomMessage(message.data);
        break;
      case "ready":
        readyMessage(message.data);
        break;
      case "begin":
        beginMessage();
        break;
      case "finish":
        finishMessage(message.data);
        break;
      case "leaveRoom":
        leaveMessage(message.data);
        break;
      case "gameAgain":
        console.log("gameGgain", message.data);
        gameGgaigMessage(message.data);
        break;
      default:
        break;
    }
  };

  const { concateSocket, sendMessage } = useWebSocket({
    onMessage: handleOnMessage,
  });

  const joinRoomMessage = (data: MessageData) => {
    handleEnterRoom(data.userId, data.roomId);
    showToast({
      title: `${data.username}加入了房间`,
      icon: "success",
    });
  };
  const readyMessage = (data: MessageData) => {
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any) => {
          if (item.id === data.content.userId) {
            return {
              ...item,
              status: data.content.status,
            };
          }
          return item;
        }),
      };
    });
  };
  const beginMessage = async () => {
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any) => {
          return {
            ...item,
            status: "begin",
          };
        }),
      };
    });
    setBtnDisabled(false);
  };
  const finishMessage = async (data: MessageData) => {
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any) => {
          if (item.id === data.content.userId) {
            return {
              ...item,
              points: data.content.points,
              score: data.content.score,
              status: "finished",
            };
          }
          return item;
        }),
      };
    });
  };

  const leaveMessage = async (data: MessageData) => {
    try {
      setRoomInfo((prevRoomInfo: any) => {
        return {
          ...prevRoomInfo,
          players: prevRoomInfo.players.filter(
            (item: any) => item.id !== data.userId
          ),
        };
      });
      showToast({
        title: `${data.username}离开了房间`,
        icon: "success",
      });
      let res = await postLeaveRoom({
        userId: data.userId,
        roomId: data.roomId,
      });
      if (res.code === 0) {
        // todu
      }
    } catch (error) {}
  };
  const gameGgaigMessage = async (data: MessageData) => {
    console.log("data", data);
    setRoomInfo((prevRoomInfo: any) => {
      return {
        ...prevRoomInfo,
        players: prevRoomInfo.players.map((item: any, index: number) => {
          return {
            ...item,
            points: [],
            isOwner: index === 0,
            score: null,
            status: "wait",
          };
        }),
      };
    });
  };
  // ---------------------------------------------- message event end ------------------------------------------------

  return (
    <View className={styles["room-container"]}>
      <AtMessage />
      <View className={styles["dice-bg"]}>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
      </View>
      <View className={styles["player-container"]}>
        {roomInfo?.players.map((player: any) => {
          return (
            <View className={styles["player-item"]} key={player.id}>
              <View className={styles["player-name"]}>{player.username}</View>

              <View className={styles["player-avatar"]}>
                <View
                  className={classNames(styles["status-wrapper"], {
                    [styles["wait"]]: player.status === "wait",
                    [styles["ready"]]: player.status === "ready",
                    [styles["begin"]]: player.status === "begin",
                    [styles["finished"]]: player.status === "finished",
                  })}
                >
                  {stateMap[player.status]}
                </View>
                <Image src={player.headPic} className={styles["avatar"]} />
              </View>

              <View className={styles["point-wrapper"]}>
                {player.points.map((point: any, index: number) => {
                  return <View key={index}>{diceEl[point]}</View>;
                })}
                <View className={styles["dice-score"]}>{player.score}</View>
              </View>
            </View>
          );
        })}
        {expandRoomInfo?.fullHoust === false && (
          <Button openType="share" className={styles["add-player"]}>
            <View className={styles["add-player-wrapper"]}>
              <View
                className={classNames([
                  "iconfont",
                  "icon-add1",
                  styles["add-icon"],
                ])}
              ></View>
              <View className={styles["add-text"]}>邀请</View>
            </View>
          </Button>
        )}
      </View>

      <View className={styles["dice-container"]}>
        <View className={styles["dice-wrapper"]}>
          {roomInfo?.gameType === 1 && <BmDice ref={dice1Ref} />}
          {roomInfo?.gameType === 2 && (
            <>
              <BmDice ref={dice1Ref} />
              <BmDice ref={dice2Ref} />
            </>
          )}
        </View>
        {btnEle()}
      </View>
    </View>
  );
};

export default GameRoom;
