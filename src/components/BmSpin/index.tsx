import React, { useState, useEffect, CSSProperties } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";

export interface TaroSpinProps {
  /**
   * 是否为加载中状态
   */
  spinning?: boolean;
  /**
   * 自定义描述文案
   */
  tip?: string;
  /**
   * 大小，可选值为 'small', 'default', 'large'
   */
  size?: "small" | "default" | "large";
  /**
   * 自定义样式
   */
  style?: CSSProperties;
  /**
   * 需要包裹的内容
   */
  children?: React.ReactNode;
  /**
   * 延迟显示加载效果的时间（防止闪烁）
   */
  delay?: number;
  /**
   * 容器类名
   */
  className?: string;
}

const TaroSpin: React.FC<TaroSpinProps> = ({
  spinning = true,
  tip,
  size = "default",
  style,
  children,
  delay = 0,
  className = "",
}) => {
  const [shouldShowSpin, setShouldShowSpin] = useState(
    delay === 0 ? spinning : false
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (delay > 0) {
      if (spinning) {
        timer = setTimeout(() => {
          setShouldShowSpin(true);
        }, delay);
      } else {
        setShouldShowSpin(false);
      }
    } else {
      setShouldShowSpin(spinning);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [spinning, delay]);

  // 加载指示符
  const spinElement = (
    <View className={`taro-spin taro-spin-${size}`} style={style}>
      <View className="taro-spin-indicator">
        <View className={`taro-spin-dot taro-spin-dot-${size}`}>
          <View className="taro-spin-dot-item"></View>
          <View className="taro-spin-dot-item"></View>
          <View className="taro-spin-dot-item"></View>
          <View className="taro-spin-dot-item"></View>
        </View>
      </View>
      {tip && <Text className="taro-spin-text">{tip}</Text>}
    </View>
  );

  // 如果没有子元素，只渲染spin组件
  if (!children) {
    return shouldShowSpin ? spinElement : null;
  }

  // 如果有子元素，根据spinning状态添加遮罩
  return (
    <View className={`taro-spin-container ${className}`}>
      <View className="taro-spin-content">{children}</View>
      {shouldShowSpin && (
        <View className="taro-spin-overlay">{spinElement}</View>
      )}
    </View>
  );
};

export default TaroSpin;
