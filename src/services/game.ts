
import { request } from "./request";

const baseUrl = process.env.TARO_APP_BASEURL;
export const getRoomInfo = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/room/get-room",
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

export const postEnterRoom = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/game/enter-room",
      method: "POST",
      data,
      success: (data) => {
        resolve(data);
      },
      fail: (err) => {
        console.log("err22", err);
        reject(err);
      },
    });
  });
};

export const postLeaveRoom = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/game/leave-room",
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

export const postAddPlayer = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/game/add-player",
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

export const postRemovePlayer = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/game/remove-player",
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


export const getGameHistory = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/game/game-history",
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
