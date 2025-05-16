export default defineAppConfig({
  pages: [
        "pages/gameRoom/index",
    "pages/enterRoom/index",
    "pages/index/index",
    "pages/createRoom/index",

  ],

  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  lazyCodeLoading: "requiredComponents",
});
