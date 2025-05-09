import { PropsWithChildren, useEffect } from "react";
import { useLaunch, login } from "@tarojs/taro";
import { postLogin } from "@/services/user";
import { useGlobalStore } from "@/zustand/index"


import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  const { updateOpenid, updateUserInfo } = useGlobalStore()

  useLaunch(() => {
    login({
      success: async ({ code }) => {
        updateOpenid(code);
        let res = await postLogin({ code });
        if (res.code === 0) {
          updateUserInfo(res.data.result);
        }
      },
    });
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
