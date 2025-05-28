
import { uploadFile } from "@tarojs/taro";
import { request } from "./request";

const baseUrl = process.env.TARO_APP_BASEURL;

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

export const postUploadFile = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    uploadFile({
      url: baseUrl + "/oss/upload-file",
      filePath: data.filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
      },
      success: (res) => {
        resolve(JSON.parse(res.data));
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
