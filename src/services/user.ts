import { baseUrl } from "./constant";
// import { request } from "@tarojs/taro";
import { request } from "./request";

export const postLogin = (data: { code: string }): Promise<any> => {
  console.log("baseUrl", baseUrl);
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/user/login",
      method: "POST",
      data,
      success: (data) => {
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const postH5Login = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/user/h5-login",
      method: "POST",
      data,

      success: (data) => {
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 跟新用户信息
export const postUpdateUserInfo = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/user/update-user-info",
      method: "POST",
      data,
      success: (data) => {
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 创建房间
export const postCreateRoom = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/room/create-room",
      method: "POST",
      data,
      success: (data) => {
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 获取房间
export const getRoom = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/room/create-room",
      method: "GET",
      data,
      success: (data) => {
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
