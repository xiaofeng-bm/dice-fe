import React, { useRef } from "react";
import { View, Text } from "@tarojs/components";
import styles from "./index.module.scss";

export interface SpinProps {
  /**
   * 是否为加载中状态
   * @default true
   */
  spinning?: boolean;
  /**
   * 包装的内容
   */
  children?: React.ReactNode;
  /**
   * 自定义描述文案
   */
  tip?: string;
}

/**
 * 简单的加载中组件
 */
const BmSpin: React.FC<SpinProps> = ({
  spinning = false,
  children,
  tip,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  // 如果没有子元素，则直接返回加载图标
  if (!children) {
    return (
      <View className={styles.spinner}>
        <View className={styles.bounce1}></View>
        <View className={styles.bounce2}></View>
        <View className={styles.bounce3}></View>
        {tip && <Text className={styles.tip}>{tip}</Text>}
      </View>
    );
  }

  // 如果有子元素，则创建一个容器，同时显示子元素和Loading
  return (
    <View className={styles.container} ref={containerRef}>
      <View ref={childrenRef}>
        {children}
      </View>
      
      {spinning && (
        <View className={styles.mask}>
          <View className={styles.spinner}>
            <View className={styles.bounce1}></View>
            <View className={styles.bounce2}></View>
            <View className={styles.bounce3}></View>
            {tip && <Text className={styles.tip}>{tip}</Text>}
          </View>
        </View>
      )}
    </View>
  );
};

export default BmSpin;
