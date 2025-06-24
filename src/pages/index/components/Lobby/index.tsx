import { postEnterRoom } from "@/services/game";
import { View } from "@tarojs/components";
import { showToast, navigateTo, useRouter } from "@tarojs/taro";
import { useGlobalStore } from "@/zustand";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Loading,
  Space,
  Image,
  HoverButton,
  Animate,
} from "@nutui/nutui-react-taro";
import {
  UserAdd,
  Clock,
  ArrowRight,
  Refresh,
  Add,
} from "@nutui/icons-react-taro";

import classNames from "classnames";
import styles from "./index.module.scss";
import { getHotRooms } from "@/services/room";

import "@/assets/iconfont/iconfont.css";

const Lobby = () => {
  const { userInfo } = useGlobalStore();
  const { params } = useRouter();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const [hotRooms, setHotRooms] = useState<any[]>([]);

  useEffect(() => {
    if (params.roomId && params.roomId !== "undefined") {
      setRoomId(params.roomId as string);
    }
    init();
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

  const getDiffTime = (time: string) => {
    const now = new Date();
    const target = new Date(time);

    let diff = Math.abs(now.getTime() - target.getTime()) / 1000; // 秒数

    const minutes = Math.floor(diff / 60);

    return `${minutes}分钟前`;
  };

  const handleEnterRoom = async (roomId: string) => {
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

  return (
    <View className={styles["enter-container"]}>
      {loading && <Loading className="global-loading" type="spinner" />}

      <HoverButton>
        <Animate type="ripple" loop>
          <View
            className={styles["add-hover"]}
            onClick={() => {
              console.log("点击新建房间");
              navigateTo({
                url: `/pages/createRoom/index`,
              });
            }}
          >
            <Add width={20} height={20} color="#fff" />
            <View className={styles["add-text"]}>新建房间</View>
          </View>
        </Animate>
      </HoverButton>

      <View className={styles["enter-content"]}>
        <View className={styles["join-room"]}>
          <Row className={styles["options-container"]} gutter={10}>
            <Col span={18}>
              <Input
                className={styles["input"]}
                placeholder="输入房间号"
                value={roomId}
                align="center"
                onChange={(val) => setRoomId(val)}
              />
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                className={styles["enter-btn"]}
                onClick={handleEnter}
              >
                进入
              </Button>
            </Col>
          </Row>
        </View>
      </View>

      <View className={styles["hot-rooms"]}>
        <View className={styles["label-container"]}>
          <View className={styles["label-text"]}>热门房间</View>
          <View
            className={styles["refresh-container"]}
            onClick={getHotRoomList}
          >
            <Refresh width={15} height={15} style={{ marginRight: "5px" }} />
            <View className={styles["refresh-text"]}>刷新</View>
          </View>
        </View>

        {hotRooms.map((room: any) => {
          console.log('room', room)
          const ownerUser = room.players.find(
            (player) => player.id === room.ownerId
          );
          return (
            <Space className={styles["room-container"]} direction="vertical">
              <View className={styles["room-header"]}>
                <View className={styles["room-name"]}>{room.roomName}</View>
              </View>
              <View className={styles["room-info"]}>
                <View className={styles["info-item"]}>
                  <UserAdd
                    className={styles["icon"]}
                    width={15}
                    height={15}
                  ></UserAdd>
                  <View
                    className={styles["num"]}
                  >{`${room.players.length}/${room.playerLimit}人`}</View>
                </View>
                <View className={styles["info-item"]}>
                  <Clock
                    className={styles["icon"]}
                    width={15}
                    height={15}
                  ></Clock>
                  <View className={styles["num"]}>
                    {getDiffTime(room.createTime)}
                  </View>
                </View>
              </View>

              <View className={styles["room-footer"]}>
                <View className={styles["host-info"]}>
                  <Image
                    className={styles["host-avatar"]}
                    src={ownerUser?.headPic}
                    mode="scaleToFill"
                    width="28px"
                    height="28px"
                    radius="14px"
                  ></Image>
                  <View className={styles["host-name"]}>
                    {ownerUser?.username}
                  </View>
                </View>
                <View
                  className={styles["join-info"]}
                  onClick={() => handleEnterRoom(room.roomId)}
                >
                  <View>点击加入</View>
                  <ArrowRight width={15} height={15} />
                </View>
              </View>
            </Space>
          );
        })}
      </View>
    </View>
  );
};

export default Lobby;
