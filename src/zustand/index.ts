import { create } from "zustand";

interface StoreState {
  openid: string;
  updateOpenid: (newOpenid: string) => void;

  userInfo: any;
  updateUserInfo: (userInfo: any) => void;

  roomInfo: any;
  updateRoomInfo: (roomInfo: any) => void;
}

export const useGlobalStore = create<StoreState>((set) => {
  return {
    openid: "",
    updateOpenid: (newOpenid) => set({ openid: newOpenid }),
    userInfo: null,
    updateUserInfo: (userInfo) => set({ userInfo }),
    roomInfo: null,
    updateRoomInfo: (roomInfo) => set({ roomInfo }),
  };
});
