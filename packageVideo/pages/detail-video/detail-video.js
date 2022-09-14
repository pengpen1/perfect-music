import { getVideoUrl, getMvInfo, getMvRelated } from "../../../services/video";

// pages/detail-video/detail-video.js
Page({
  data: {
    id: 0,
    videoUrl: "",
    danmuList: [
      {
        text: "唱功杠杠的！",
        color: "#ff0000",
        time: 2,
      },
      {
        text: "我爱你zzw",
        color: "#ff00ff",
        time: 4,
      },
      {
        text: "我好喜欢这首歌！！！yyds",
        color: "#ffff00",
        time: 7,
      },
    ],
    mvInfo: {},
    mvRelated: [],
    scrollHeight: "764rpx",
  },
  onLoad(options) {
    // 1.点击的同时也会传入对应的id
    this.setData({
      id: options.id,
    });
    //   2.发送网络请求
    this.fetchVideoUrl();
    this.fetchMvInfo();
    this.fetchMvRelated();
    // 3.动态设置一下滚动区域的高度
    wx.getSystemInfo({
      success: (result) => {
        const height = result.windowHeight - 225;
        this.setData({
          scrollHeight: height + "px",
        });
      },
    });
  },
  async fetchVideoUrl() {
    const urlRes = await getVideoUrl(this.data.id);
    this.setData({
      videoUrl: urlRes.data.url,
    });
  },
  async fetchMvInfo() {
    // mvid === id
    const mvInfoRes = await getMvInfo(this.data.id);
    this.setData({
      mvInfo: mvInfoRes.data,
    });
  },
  async fetchMvRelated() {
    const mvRelatedRes = await getMvRelated(this.data.id);
    this.setData({
      mvRelated: mvRelatedRes.data,
    });
  },
});
