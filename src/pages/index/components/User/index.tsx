import { postUpdateUserInfo, postUploadFile } from "@/services/user";

import { showToast } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import { Button, Space, Input } from "@nutui/nutui-react-taro";
import { useGlobalStore } from "@/zustand/index";

import classNames from "classnames";
import styles from "./index.module.scss";
const User = () => {
  const { userInfo, updateUserInfo } = useGlobalStore();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [nickName, setNickName] = useState("");

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo) {
      setAvatarUrl(userInfo.headPic);
      setNickName(userInfo.username);
    }
  }, [userInfo]);

  console.log("avatarUrl", avatarUrl);

  const onChooseAvatar = async (e: any) => {
    const { avatarUrl } = e.detail;

    try {
      let res = await postUploadFile({
        filePath: avatarUrl,
      });
      if (res.code === 0) {
        setAvatarUrl(res.data.url);
      }
    } catch (error) {
      console.error("上传头像失败", error);
    }
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
  const handleSave = async () => {
    if (validate()) return;
    setSaveLoading(true);
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
        showToast({
          title: "更新用户信息成功",
          icon: "success",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setSaveLoading(false);
  };


  return (
    <View className={styles["user-container"]}>
      <View className={styles["content-area"]}>
        <Space className={styles["logo-container"]}>
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
        </Space>
      </View>

      <Space direction="vertical">
        <View>
          <Button
            className="width-80"
            type="success"
            openType="chooseAvatar"
            onChooseAvatar={onChooseAvatar}
          >
            上传头像
          </Button>

          <View className="tip-wrapper">
            我们收集您的头像信息，仅用于房间内展示，方便其它用户识别您。
          </View>
        </View>

        <View>
          <Input
            className={styles["nickname-input"]}
            type="nickname"
            placeholder="请输入昵称"
            align="center"
            value={nickName}
            onChange={(name: string) => {
              setNickName(name);
            }}
          />
          <View className="tip-wrapper">
            我们收集您的昵称信息，仅用于房间内展示，方便其它用户识别您。
          </View>
        </View>

        <Button
          type="primary"
          className="width-80"
          loading={saveLoading}
          onClick={handleSave}
        >
          保存信息
        </Button>
      </Space>
    </View>
  );
};

export default User;
