import { PropsWithChildren } from "react";
import { useLaunch, login, navigateTo } from "@tarojs/taro";
import { postLogin } from "@/services/user";
import { useGlobalStore } from "@/zustand/index";

import "@nutui/nutui-react-taro/dist/style.css";

import "./app.scss"; // 确保在 NutUI 样式之后导入

function App({ children }: PropsWithChildren<any>) {
  const { updateOpenid, updateUserInfo } = useGlobalStore();

  useLaunch(() => {
    login({
      success: async ({ code }) => {
        updateOpenid(code);
        let res = await postLogin({ code });
        if (res.code === 0) {
          const userData = res.result;
          updateUserInfo(userData);
          if (res.errMsg) {
            // 用户信息不完整
            navigateTo({
              url: `/pages/index/index?tab=2`,
            });
          }
        }
      },
    });
  });

  return children;
}

export default App;
