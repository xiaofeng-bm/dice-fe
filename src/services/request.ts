import { request as wxRequest, showToast } from "@tarojs/taro";

export const request = ({ url, method, data, success, fail }: any) => {
  return wxRequest({
    url: url,
    method: method,
    data,
    success: ({ data }) => {
      if (data.code === 0) {
        success(data);
      } else {
        showToast({
          title: data.data || data.msg,
          icon: "error",
          duration: 2000,
        });
      }
    },
    fail: (err) => {
      showToast({
        title: '网络错误',
        icon: "error",
        duration: 2000,
      });
      fail(err);
    },
  });
};
