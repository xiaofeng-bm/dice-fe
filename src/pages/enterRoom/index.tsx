import { postEnterRoom } from "@/services/game";
import { View, Image, Input } from "@tarojs/components";
import { navigateBack, showToast, navigateTo, useRouter } from "@tarojs/taro";
import { useGlobalStore } from "@/zustand";

import { useEffect, useState } from "react";
import BmButton from "@/components/BmButton";
import { AtMessage } from "taro-ui";

import classNames from "classnames";
import styles from "./index.module.scss";

const EnterRoom = () => {
  const { userInfo } = useGlobalStore();
  const { params } = useRouter();
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (params.roomId && params.roomId !== "undefined") {
      setRoomId(params.roomId as string);
    }
  }, []);

  const handleEnter = async () => {
    if (!roomId) {
      showToast({
        title: "请输入房间号",
        icon: "none",
      });
      return;
    }
    try {
      let res = await postEnterRoom({
        userId: userInfo?.id,
        roomId: roomId,
      });
      if (res.code === 0) {
        showToast({
          title: "进入房间成功",
          icon: "success",
        });
        navigateTo({
          url: `/pages/gameRoom/index?roomId=${roomId}`,
        });
      }
    } catch (error) {}
  };
  const goBack = () => {
    navigateBack({
      delta: 1,
    });
  };
  return (
    <View className={styles["enter-container"]}>
      <AtMessage />
      <View className={styles["nav-container"]}>
        <View className={styles["back"]} onClick={goBack}>
          返回
        </View>
        <View className={styles["user-container"]}>
          <View className={styles["name"]}>{userInfo?.username}</View>
          <View className={styles["user-avatar"]}>
            <Image src={userInfo?.headPic} className={styles["avatar"]} />
          </View>
        </View>
      </View>

      <View className={styles["enter-content"]}>
        <View className={styles["join-room"]}>
          <View className={styles["label-text"]}>房间类型</View>
          <View className={styles["options-container"]}>
            <Input
              className={classNames("input-default", styles["input"])}
              placeholder="输入房间号"
              value={roomId}
              onInput={(e) => setRoomId(e.detail.value)}
            />
            <BmButton
              type="primary"
              className={styles["enter-btn"]}
              onClick={handleEnter}
            >
              进入
            </BmButton>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EnterRoom;
