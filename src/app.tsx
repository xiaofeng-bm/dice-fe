import { PropsWithChildren } from "react";
import { useLaunch, login, useRouter, redirectTo } from "@tarojs/taro";
import { postLogin } from "@/services/user";
import { useGlobalStore } from "@/zustand/index";

import "@nutui/nutui-react-taro/dist/style.css";
import { ConfigProvider } from "@nutui/nutui-react-taro";
import { customTheme } from "@/utils/theme";

import "./app.scss"; // 确保在 NutUI 样式之后导入

function App({ children }: PropsWithChildren<any>) {
  const { userInfo, updateOpenid, updateUserInfo } = useGlobalStore();
  const router = useRouter();

  useLaunch(() => {
    login({
      success: async ({ code }) => {
        updateOpenid(code);
        let res = await postLogin({ code });
        if (res.code === 0) {
          const userData = res.data.result;
          updateUserInfo(userData);
        }
      },
    });
  });

  return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
}

export default App;
