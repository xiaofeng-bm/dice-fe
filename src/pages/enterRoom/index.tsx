import { postEnterRoom } from "@/services/game";
import { View, Image, Input } from "@tarojs/components";
import { navigateBack, showToast, navigateTo, useRouter } from "@tarojs/taro";
import { useGlobalStore } from "@/zustand";

import { useEffect, useState } from "react";
import BmButton from "@/components/BmButton";

import classNames from "classnames";
import styles from "./index.module.scss";
import { getHotRooms } from "@/services/room";

import "@/assets/iconfont/iconfont.css";

const EnterRoom = () => {
  const { userInfo } = useGlobalStore();
  const { params } = useRouter();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const [hotRooms, setHotRooms] = useState<any[]>([]);

  useEffect(() => {
    if (params.roomId && params.roomId !== "undefined") {
      setRoomId(params.roomId as string);
    }
    // init();
  }, []);

  const init = () => {
    getHotRoomList();
  };

  const getHotRoomList = async () => {
    setLoading(true);
    try {
      let res = await getHotRooms({
        roomType: "public",
      });
      if (res.code === 0) {
        setHotRooms(res.data);
      }
    } catch (error) {
      console.error("获取热门房间列表失败", error);
    } finally {
      // 模拟加载延迟，方便测试加载动画效果
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

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

            <BmButton type="primary" onClick={handleEnter}>
              进入
            </BmButton>
          </View>
        </View>
      </View>

      <View className={styles["hot-rooms"]}>
        <View className={styles["label-container"]}>
          <View className={styles["label-text"]}>热门房间</View>
          <View
            className={styles["refresh-container"]}
            onClick={getHotRoomList}
          >
            <View
              className={classNames(
                ["iconfont", "icon-shuaxin"],
                styles["icon"]
              )}
            ></View>
            <View className={styles["refresh-text"]}>刷新</View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EnterRoom;
