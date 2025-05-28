
import { request } from "./request";

const baseUrl = process.env.TARO_APP_BASEURL;
export const getHotRooms = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + "/room/hot-rooms",
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