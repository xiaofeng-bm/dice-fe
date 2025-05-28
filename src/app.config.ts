export default defineAppConfig({
  pages: [
        "pages/enterRoom/index",
    "pages/index/index",

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
