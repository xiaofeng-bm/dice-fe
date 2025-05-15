import { PropsWithChildren, useEffect } from "react";
import { useLaunch, login, useRouter } from "@tarojs/taro";
import { postLogin, postH5Login } from "@/services/user";
import { useGlobalStore } from "@/zustand/index"


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
          updateUserInfo(res.data.result);
          console.log('res', res)
        }
      },
    });
  });

  useEffect(() =>{
    init();
  }, [])

  const init = async () => {
    console.log('userInfo', userInfo)
    try {
      let res = await postH5Login({
        id: Number(router.params.id)
      });
      if(res.code === 0) {
        updateUserInfo(res.data.result);
        console.log('res', res)
      }
    } catch (error) {
      
    }
  }
  // children 是将要会渲染的页面
  return children;
}

export default App;
