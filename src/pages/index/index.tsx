import { postUpdateUserInfo, postUploadFile } from "@/services/user";
import { View, Image, Input } from "@tarojs/components";
import { useLoad, showToast, navigateTo, useRouter } from "@tarojs/taro";

import { useEffect, useState } from "react";
import classNames from "classnames";

import BmButton from "@/components/BmButton";
import { AtMessage } from "taro-ui";
import { Button, ConfigProvider } from "@nutui/nutui-react-taro";
import BmSpin from "@/components/BmSpin";

import styles from "./index.module.scss";
import { useGlobalStore } from "@/zustand/index";

export default function Index() {
  const { params } = useRouter();

  const [saveLoading, setSaveLoading] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [nickName, setNickName] = useState("");

  const { userInfo, updateUserInfo } = useGlobalStore();

  useLoad(() => {
    // todu
  });

  useEffect(() => {
    if (userInfo) {
      setAvatarUrl(userInfo.headPic);
      setNickName(userInfo.username);
    }
  }, [userInfo]);

  const onChooseAvatar = async (e: any) => {
    const { avatarUrl } = e.detail;

    try {
      let res = await postUploadFile({
        filePath: avatarUrl,
      });
      if (res.code === 0) {
        setAvatarUrl(res.data.url);
      }
      console.log("上传头像成功", res);
    } catch (error) {
      console.error("上传头像失败", error);
    }
  };

  const handleEnter = async (type: "enterRoom" | "createRoom") => {
    if (validate()) return;
    setSaveLoading(type);
    try {
      let res = await postUpdateUserInfo({
        id: Number(userInfo?.id),
        avatarUrl,
        nickName,
      });
      if (res.code === 0) {
        updateUserInfo({
          ...userInfo,
          avatarUrl,
          nickName,
        });
        if (type === "enterRoom") {
          navigateTo({
            url: `/pages/enterRoom/index?roomId=${params?.roomId}`,
          });
        } else {
          navigateTo({
            url: `/pages/createRoom/index?avatarUrl=${avatarUrl}&nickName=${nickName}`,
          });
        }
      }
    } catch (error) {}
    setSaveLoading(null);
  };

  const validate = () => {
    if (!avatarUrl) {
      showToast({
        title: "请上传头像",
        icon: "none",
      });
      return true;
    }
    if (!nickName) {
      showToast({
        title: "请输入昵称",
        icon: "none",
      });
      return true;
    }
    return false;
  };

  return (
    <View className={styles.container}>

      <Button type="primary">aaa</Button>
    
      <AtMessage />
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
      <BmButton
        className="width-80"
        type="success"
        openType="chooseAvatar"
        onChooseAvatar={onChooseAvatar}
      >
        上传头像
      </BmButton>



      <View className="tip-wrapper">
        我们收集您的头像信息，仅用于房间内展示，方便其它用户识别您。
      </View>
      <Input
        className={styles["nickname-input"]}
        type="nickname"
        placeholder="请输入昵称"
        value={nickName}
        onInput={(e) => setNickName(e.detail.value)}
      />
      <View className="tip-wrapper">
        我们收集您的昵称信息，仅用于房间内展示，方便其它用户识别您。
      </View>

      <BmSpin spinning={saveLoading === "enterRoom"}>
        <BmButton
          className={classNames(["width-80", styles["start-btn"]])}
          type="success"
          // disabled={params?.roomId === "undefined"}
          onClick={() => handleEnter("enterRoom")}
        >
          进入房间
        </BmButton>
      </BmSpin>

      <BmSpin spinning={saveLoading === "createRoom"} className="margin-top-20">
        <BmButton
          className={classNames(["width-80"])}
          type="primary"
          onClick={() => handleEnter("createRoom")}
        >
          创建房间
        </BmButton>
      </BmSpin>
    </View>
  );
}
