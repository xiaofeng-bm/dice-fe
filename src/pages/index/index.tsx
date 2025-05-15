import { postUpdateUserInfo } from "@/services/user";
import { View, Text, Image, Input, Button } from "@tarojs/components";
import { useLoad, showToast, navigateTo } from "@tarojs/taro";
import { useState } from "react";
import classNames from "classnames";
import BmButton from "@/components/BmButton";
import styles from "./index.module.scss";
import { useGlobalStore } from "@/zustand/index";

export default function Index() {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [nickName, setNickName] = useState("");

  const { userInfo, updateUserInfo } = useGlobalStore();
  console.log("userInfo", userInfo);

  useLoad(() => {
    // todu
  });



  const onChooseAvatar = (e: any) => {
    const { avatarUrl } = e.detail;
    setAvatarUrl(avatarUrl);
  };

  const handleAvatar = (url: string) => {
    setAvatarUrl(url);
  };

  const handleEnter = async () => {
    if (!avatarUrl) {
      showToast({
        title: "请上传头像",
        icon: "none",
      });
      return;
    }
    if (!nickName) {
      showToast({
        title: "请输入昵称",
        icon: "none",
      });
      return;
    }
    try {
      let res = await postUpdateUserInfo({
        id: userInfo.id,
        avatarUrl,
        nickName,
      });
      if (res.code === 0) {
        updateUserInfo({
          ...userInfo,
          avatarUrl,
          nickName,
        });
        navigateTo({
          url: `/pages/createRoom/index?avatarUrl=${avatarUrl}&nickName=${nickName}`,
        });
      }
    } catch (error) {}
  };

  return (
    <View className={styles.container}>
      <View className={styles["dice-bg"]}>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
        <View className={styles["dice"]}>🎲</View>
      </View>

      <View className={styles["contene-area"]}>
        <View className={styles["logo-container"]}>
          <View className={styles["logo"]}>
            <View className={styles["logo-glow"]}></View>
            <Image className={styles["logo-inner"]} src={avatarUrl} />
          </View>
          <View
            className={classNames([styles["app-name"], styles["neno-text"]])}
          >
            摇骰子
          </View>
          <View className={styles["slogan"]}>聚会助手，欢乐无限</View>
        </View>
      </View>
      {/* <BmButton
        className="width-80"
        type="success"
        openType="chooseAvatar"
        onChooseAvatar={onChooseAvatar}
      >
        上传头像
      </BmButton> */}
      <View
        onClick={() =>
          handleAvatar(
            "https://baimin.oss-cn-beijing.aliyuncs.com/%E8%83%A1%E6%AD%8C.jpg"
          )
        }
      >
        选择胡歌
      </View>
      <View
        onClick={() =>
          handleAvatar(
            "https://baimin.oss-cn-beijing.aliyuncs.com/a8019f519bebc2fee198eb1e4668b7ee.png"
          )
        }
      >
        选择大猫
      </View>
      <View
        onClick={() =>
          handleAvatar(
            "https://baimin.oss-cn-beijing.aliyuncs.com/08f68a6160c3bd8f96665ad2b96b1632.jpeg"
          )
        }
      >
        选择哪吒
      </View>
      <Input
        className={styles["nickname-input"]}
        type="nickname"
        placeholder="请输入昵称"
        value={nickName}
        onInput={(e) => setNickName(e.detail.value)}
      />

      <BmButton
        className={classNames(["width-80", styles["start-btn"]])}
        type="primary"
        onClick={handleEnter}
      >
        开始游戏
      </BmButton>
    </View>
  );
}
