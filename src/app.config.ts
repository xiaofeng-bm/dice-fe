export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/enterRoom/index",
    "pages/createRoom/index",
    "pages/gameRoom/index",
  ],

  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  lazyCodeLoading: "requiredComponents",
});
