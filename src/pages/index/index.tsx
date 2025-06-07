import { View } from "@tarojs/components";

import { useMemo, useState } from "react";

import Lobby from "./components/Lobby";
import History from "./components/History";
import UserInfo from "./components/User";

import { Tabbar } from "@nutui/nutui-react-taro";
import { Clock, Home, User } from "@nutui/icons-react-taro";

import styles from "./index.module.scss";

export default function Index() {
  const [activeTab, setActiveTab] = useState(0);

  const ContentDOM = useMemo(() => {
    let dom;
    switch (activeTab) {
      case 0:
        dom = <Lobby />;
        break;
      case 1:
        dom = <History />;
        break;
      case 2:
        dom = <UserInfo />;
        break;
      default:
        dom = <Lobby />;
        break;
    }
    return dom;
  }, [activeTab]);

  return (
    <View className={styles.container}>
      {ContentDOM}
      <Tabbar fixed value={activeTab} onSwitch={(index) => setActiveTab(index)}>
        <Tabbar.Item title="大厅" icon={<Home />} />
        <Tabbar.Item title="记录" icon={<Clock />} />
        <Tabbar.Item title="个人信息" icon={<User />} />
      </Tabbar>
    </View>
  );
}
