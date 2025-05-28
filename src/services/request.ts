import { request as wxRequest, atMessage } from "@tarojs/taro";

export const request = ({ url, method, data, success, fail }: any) => {
  return wxRequest({
    url: url,
    method: method,
    data,
    success: ({ data }) => {
      if (data.code === 0) {
        success(data);
      } else {
        atMessage({
          "message": data.data || data.msg,
          "type": 'warning'
        })
      }
    },
    fail: (err) => {
      fail(err);
    },
  });
};
