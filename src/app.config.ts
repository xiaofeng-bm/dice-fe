export default defineAppConfig({
  pages: [
    "pages/createRoom/index",
    "pages/index/index",
    "pages/enterRoom/index",

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
