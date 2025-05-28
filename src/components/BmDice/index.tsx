import { View } from "@tarojs/components";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useRef, useState, useImperativeHandle, forwardRef, useEffect } from "react";

const rotations = [
  { x: 0, y: 0, z: 0 }, // 1点朝前
  { x: 0, y: -90, z: 0 }, // 2点朝前
  { x: 0, y: 180, z: 0 }, // 3点朝前
  { x: 0, y: 90, z: 0 }, // 4点朝前
  { x: -90, y: 0, z: 0 }, // 5点朝前
  { x: 90, y: 0, z: 0 }, // 6点朝前
];

const BmDice = forwardRef((props: any, ref: any) => {
  const diceRef = useRef<HTMLDivElement>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 添加组件卸载时的清理
  useEffect(() => {
    return () => {
      // 清除计时器，防止组件卸载后继续执行
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => {
    return {
      handleShake,
      diceValue,
      resetDice
    }
  })

  // 新增重置函数，用于清除计时器
  const resetDice = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const handleShake = () => {
    // 清除之前的计时器
    resetDice();
    
    if (diceRef.current) {
      setDiceValue(null);
      diceRef.current.style.transition = "none";
      diceRef.current.style.transform =
        "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

      // 生成骰子的随机点数（1-6）
      const dice1Value = Math.floor(Math.random() * 6);

      // 获取对应点数的旋转角度
      const finalRotation1 = rotations[dice1Value];

      // 重新启用动画并设置新的transform
      requestAnimationFrame(() => {
        if (diceRef.current) {
          diceRef.current.style.transition =
            "transform 5s cubic-bezier(0.2, 0.1, 0.3, 1)";

          // 在动画过程中添加额外旋转，但最终停在正确的角度
          const spins = 1080; // 3圈
          diceRef.current.style.transform = `rotateX(${
            finalRotation1.x + spins
          }deg) rotateY(${finalRotation1.y + spins}deg) rotateZ(0deg)`;
        }
      });

      // 动画结束后显示点数
      timerRef.current = setTimeout(() => {
        setDiceValue(dice1Value + 1);
        timerRef.current = null;
      }, 5000);
    }
  };

  return (
    <View className={styles["dice-wrapper"]}>
      <View className={styles["container"]}>
        <View className={styles["dice"]} ref={diceRef}>
          <View className={classNames(styles["face"], styles["face-1"])}>
            <View className={styles["dots"]}>
              <View className={styles["dot"]}></View>
            </View>
          </View>
          <View className={classNames(styles["face"], styles["face-2"])}>
            <View className={styles["dots"]}>
              <View className={styles["column"]}>
                <View className={styles["dot"]}></View>
                <View className={styles["dot"]}></View>
              </View>
            </View>
          </View>
          <View className={classNames(styles["face"], styles["face-3"])}>
            <View className={styles["dots"]}>
              <View className={styles["column"]}>
                <View className={styles["dot"]}></View>
                <View className={styles["dot"]}></View>
                <View className={styles["dot"]}></View>
              </View>
            </View>
          </View>
          <View className={classNames(styles["face"], styles["face-4"])}>
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
          <View className={classNames(styles["face"], styles["face-5"])}>
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

          <View className={classNames(styles["face"], styles["face-6"])}>
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
        </View>
      </View>
    </View>
  );
});

export default BmDice;
