import { PropsWithChildren } from "react";
import { useLaunch, login, useRouter, redirectTo } from "@tarojs/taro";
import { postLogin } from "@/services/user";
import { useGlobalStore } from "@/zustand/index";

import "./app.scss";

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

  return children;
}

export default App;
