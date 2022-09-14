import { getPlayListDetail } from "../../services/music";
import { rankingStore } from "../../store/rankingStore";
import { recommendStore } from "../../store/recommendStore";
import { playerStore } from "../../store/playerStore";

// pages/detail-song/detail-song.js
Page({
  data: {
    // 传递过来的信息
    type: "ranking",
    key: "newRanking",
    id: "",
    // 展示要用的数据
    songInfo: {},
  },
  onLoad(options) {
    // 1.确定获取的数据类型
    // type:ranking 排行榜
    // type:recommend 歌单
    const type = options.type;
    this.setData({
      type,
    });
    // 获取store中的数据
    if (type === "ranking") {
      const key = options.key;
      this.data.key = key;
      rankingStore.onState(key, this.handleRanking);
    } else if (type === "recommend") {
      this.data.key = "recommendInfo";
      recommendStore.dispatch("fetchRecommendSongsActions");
      recommendStore.onState(this.data.key, this.handleRanking);
    } else if (type === "menu") {
      const id = options.id;
      this.setData({
        id,
      });
      this.fetchMenuSongInfo();
    }
  },
  // 回调函数
  handleRanking(value) {
    if (this.data.type === "ranking") {
      // 在main-music派发的排行榜网络请求
      wx.setNavigationBarTitle({
        title: value.name,
      });
    } else if (this.data.type === "recommend") {
      value.playlist.name = "推荐歌曲";
      wx.setNavigationBarTitle({
        title: "推荐歌曲",
      });
    }

    this.setData({
      //  直接就将大对象保存起来了，需要手动掉playlist
      songInfo: value,
    });
  },
  // 第二个监听item的回调！！
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playSongList", this.data.songInfo.playlist.tracks);
    playerStore.setState("playSongIndex", index);
  },
  async fetchMenuSongInfo() {
    const songRes = await getPlayListDetail(this.data.id);
    this.setData({
      songInfo: songRes,
    });
  },
  // 卸载页面生命周期
  onUnload() {
    //  type === "ranking"移除监听
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking);
    }
  },
});
