import { PropsWithChildren } from "react";
import { useLaunch, login, useRouter, redirectTo } from "@tarojs/taro";
import { postLogin } from "@/services/user";
import { useGlobalStore } from "@/zustand/index";

import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  const { userInfo, updateOpenid, updateUserInfo } = useGlobalStore();
  const router = useRouter();

  useLaunch((options) => {
    const { query } = options;
    login({
      success: async ({ code }) => {
        updateOpenid(code);
        let res = await postLogin({ code });
        if (res.code === 0) {
          const userData = res.data.result;
          console.log("query", query);
          updateUserInfo(userData);
          if (query?.from === "share" && query?.roomId) {
            if (userData?.username && userData.headPic) {
              if (userData?.username && userData.headPic) {
                // 分享页进入，用户信息完整，跳转到游戏房间
                redirectTo({
                  url: "/pages/gameRoom/index?roomId=" + query?.roomId,
                });
              }
            } else {
              // 分享页进入，用户信息不完整，跳转到创建房间
              redirectTo({
                url: "/pages/index/index?roomId=" + query?.roomId,
              });
            }
          }
        }
      },
    });
  });

  // useEffect(() =>{
  //   init();
  // }, [])

  // const init = async () => {
  //   console.log('userInfo', userInfo)
  //   try {
  //     let res = await postH5Login({
  //       id: Number(router.params.id)
  //     });
  //     if(res.code === 0) {
  //       updateUserInfo(res.data.result);
  //       console.log('res', res)
  //     }
  //   } catch (error) {

  //   }
  // }
  // children 是将要会渲染的页面
  return children;
}

export default App;
