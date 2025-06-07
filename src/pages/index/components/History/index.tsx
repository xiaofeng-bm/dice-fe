import { View } from "@tarojs/components";
import { Empty } from "@nutui/nutui-react-taro";
import styles from "./index.module.scss";

const History = () => {
  return (
    <View className={styles['history-container']}>
      {/* <Empty title="对局记录" imageSize="100%" description="开发中，敬请期待..." /> */}
      <View className={styles['tip-empty']}>开发中，敬请期待</View>
    </View>
  );
};

export default History;
