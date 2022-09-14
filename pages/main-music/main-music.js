import { getMusicBanner, getSongMenuList } from "../../services/music";
import { querySelector } from "../../utils/query-selector";
import { recommendStore } from "../../store/recommendStore";
import { rankingStore } from "../../store/rankingStore";
import { playerStore } from "../../store/playerStore";

const app = getApp();

// pages/main-music/main-music.js
Page({
  data: {
    searchValue: "",
    musicBanner: [],
    bannerHeight: "130px",
    getImageHeightLock: false,
    recommendSongs: [],
    // 热门歌单
    hotMenuList: [],
    screenWidth: 375,
    // 推荐歌单
    recMenuList: [],
    // 榜单数据
    rankingInfos: {},
    // 状态栏
    currentSong: {},
    stateKeys: ["currentSong", "isPlaying"],
    isPlaying: false,
  },
  onLoad() {
    // 1.网络请求以及获取共享数据_推荐歌曲
    this.fetchMusicBanner();
    // 换成了下面的数据共享
    // this.fetchRecommendSongs();

    recommendStore.onState("recommendInfo", this.handleRecommendSongs);
    recommendStore.dispatch("fetchRecommendSongsActions");

    // 2.网络请求热门\推荐歌单
    this.fetchSongMenuList();

    // 3.获取屏幕宽度
    this.setData({
      screenWidth: app.globalData.screenWidth,
    });

    // 4.获取共享数据_排行榜数据
    rankingStore.onState("newRanking", this.handleNewRanking);
    rankingStore.onState("orginRanking", this.handleOrginRanking);
    rankingStore.onState("upRanking", this.handleUpRanking);
    rankingStore.dispatch("fetchRankingDataAction");

    // 5.获取共享数据_状态栏
    playerStore.onStates(this.data.stateKeys, this.handlePlayerInfo);
  },
  // 网络请求
  async fetchMusicBanner() {
    const bannerRes = await getMusicBanner();
    this.setData({
      musicBanner: bannerRes.banners,
    });
  },

  async fetchSongMenuList() {
    getSongMenuList().then((res) => {
      this.setData({
        hotMenuList: res.playlists,
      });
    });
    getSongMenuList("华语").then((res) => {
      this.setData({
        recMenuList: res.playlists,
      });
    });
  },
  // 事件回调
  onFocus() {
    wx.navigateTo({
      url: "/pages/detail-search/detail-search",
    });
  },
  onImageLoad() {
    // 执行8次有点多，加个节流锁
    if (this.data.getImageHeightLock) return;
    querySelector(".bannerImage").then((res) => {
      this.setData({
        bannerHeight: res.height + "px",
      });
    });
    this.data.getImageHeightLock = true;
    // 没封装工具函数之前的写法
    // const query = wx.createSelectorQuery();
    // query.select(".bannerImage").boundingClientRect((res) => {
    //   this.setData({
    //     bannerHeight: res.height + "px"
    //   });
    // });
    // query.exec();
  },
  onTapMore(e) {
    wx.navigateTo({
      url: "/pages/detail-song/detail-song?type=recommend",
    });
  },
  onTapMoreGetAll(e) {
    wx.navigateTo({
      url: "/pages/detail-menu/detail-menu",
    });
  },
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction");
  },
  onPlayBarAlbumTap() {
    wx.navigateTo({
      url: "/pages/music-player/music-player",
    });
  },
  onTapPlaylist(){
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  // 第二个监听item的回调！！
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playSongList", this.data.recommendSongs);
    playerStore.setState("playSongIndex", index);
  },
  // 监听store中的数据变化的回调
  handleRecommendSongs(value) {
    this.setData({
      recommendSongs: value?.playlist?.tracks?.slice(0, 6),
    });
  },
  handleNewRanking(value) {
    const newRankingInfos = { ...this.data.rankingInfos, newRanking: value };
    this.setData({
      rankingInfos: newRankingInfos,
    });
  },
  handleOrginRanking(value) {
    const newRankingInfos = { ...this.data.rankingInfos, orginRanking: value };
    this.setData({
      rankingInfos: newRankingInfos,
    });
  },
  handleUpRanking(value) {
    const newRankingInfos = { ...this.data.rankingInfos, upRanking: value };
    this.setData({
      rankingInfos: newRankingInfos,
    });
  },
  handlePlayerInfo({ currentSong, isPlaying }) {
    if (currentSong) {
      this.setData({
        currentSong,
      });
    }
    if (isPlaying !== undefined) {
      this.setData({
        isPlaying,
      });
    }
  },
  // 监听页面卸载
  onUnload() {
    recommendStore.offState("recommendInfo", this.handleRecommendSongs);
    rankingStore.offState("newRanking", this.handleNewRanking);
    rankingStore.offState("orginRanking", this.handleOrginRanking);
    rankingStore.offState("upRanking", this.handleUpRanking);

    playerStore.offStates(this.data.stateKeys, this.handlePlayerInfo);
  },
});
