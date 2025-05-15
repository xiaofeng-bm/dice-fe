import { View } from "@tarojs/components";
import classNames from "classnames";
import styles from "./index.module.scss";

export interface Players {
  id: number;
  headPic: string;
  openid: string;
  points: number[];
  score: number;
  isOwner: boolean;
  status: 'wait' | 'ready' | 'begin' |'finished';
}

export interface RoomInfo {
  gameType: number;
  id: number;
  ownerId: number;
  playerLimit: number;
  players: Players[];
  roomName: string;
  roomType: 'public'
}

export interface MessageProps {
  event: string;
  data: {
    type: string;
    [key: string]: any;
  }
}

export type MessageData = MessageProps['data'];


export interface PayloadProps {
  event: string;
  data: {
    [key: string]: any
  }
}

export enum STATUS {
  WAIT = 'wait',
  READY = 'ready',
  BEGIN = 'begin',
  FINISHED = 'finished',
}

export const stateMap = {
  [STATUS.WAIT]: '未准备',
  [STATUS.READY]: '已准备',
  [STATUS.BEGIN]: '进行中',
  [STATUS.FINISHED]: '已完成',
}

export const diceEl: any = {
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

export const  HEARTBEAT_INTERVAL = 25000; // 心跳间隔 (毫秒)