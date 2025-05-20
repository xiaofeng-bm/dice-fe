import { postCreateRoom } from "@/services/user";
import { View, Input, Button } from "@tarojs/components";
import { useEffect, useState } from "react";
import { navigateTo } from "@tarojs/taro";
import { AtInputNumber } from "taro-ui";
import "taro-ui/dist/style/components/input-number.scss";
import BmButton from "@/components/BmButton";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useGlobalStore } from "@/zustand";

const CreateRoom = () => {
  const { userInfo } = useGlobalStore();
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [playerLimit, setPlayerLimit] = useState(6);
  const [gameType, setGameType] = useState<number>(1);
  const handleCreateRoom = async () => {
    try {
      let res = await postCreateRoom({
        roomName,
        roomType,
        playerLimit,
        gameType,
        openid: userInfo.openid,
      });
      if (res.code === 0) {
        navigateTo({
          url: `/pages/gameRoom/index?roomId=${res.data.roomId}`,
        });
      }
    } catch (error) {
      console.error("创建房间失败", error);
    }
  };

  return (
    <View className={styles["create-room-container"]}>
      <View className={styles["room-info"]}>
        <View className={styles["room-name"]}>
          <View className={styles["label-text"]}>房间名称</View>
          <Input
            className={classNames("input-default")}
            placeholder="请输入房间名称"
            value={roomName}
            onInput={(e) => setRoomName(e.detail.value)}
          />
        </View>

        <View className={styles["room-type"]}>
          <View className={styles["label-text"]}>房间类型</View>
          <View className={styles["options-container"]}>
            <View
              className={classNames(styles["public"], {
                [styles["selected"]]: roomType === "public",
              })}
              onClick={() => setRoomType("public")}
            >
              公开房间
            </View>
            <View
              className={classNames(styles["private"], {
                [styles["selected"]]: roomType === "private",
              })}
              onClick={() => setRoomType("private")}
            >
              私密房间
            </View>
          </View>
        </View>

        <View className={styles["limit-container"]}>
          <View className={styles["label-text"]}>玩家数量上限</View>
          <AtInputNumber
            type="number"
            max={6}
            value={playerLimit}
            onChange={(value) => setPlayerLimit(value)}
          />
        </View>
      </View>

      <View className={styles["game-type"]}>
        <View
          className={classNames(styles["game-item"], {
            [styles["game-type-selected"]]: gameType === 1,
          })}
          onClick={() => setGameType(1)}
        >
          <View className={styles["name"]}>经典摇骰</View>
          <View className={styles["desc"]}>单骰模式，1-6点数</View>
        </View>
        <View
          className={classNames(styles["game-item"], {
            [styles["game-type-selected"]]: gameType === 2,
          })}
          onClick={() => setGameType(2)}
        >
          <View className={styles["name"]}>双骰模式</View>
          <View className={styles["desc"]}>双骰同摇，2-12点数</View>
        </View>
      </View>

      <BmButton
        style={{ width: "95%" }}
        type="primary"
        onClick={handleCreateRoom}
      >
        创建房间
      </BmButton>
    </View>
  );
};

export default CreateRoom;
