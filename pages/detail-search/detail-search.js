import { getHotSearch , getSearchResult ,getSuggestSearch} from "../../services/search";
import {playerStore } from '../../store/playerStore'

Page({
  data: {
    hots: [],
    isSearch: false,

    searchValue: "",
    suggestSongs: [],

    searchSongs: [],
  },
  // 生命周期
  onLoad(options) {
    // 发生网络请求
    this.handleHotSearch();
  },
  // 网络请求
  async handleHotSearch() {
    const hotRes = await getHotSearch();
    this.setData({
      hots: hotRes.result.hots,
    });
  },
  async  handleSearchAction() {
    const res = await getSearchResult(this.data.searchValue)
   this.setData({ searchSongs: res.result.songs });
    
  },
  // 事件回调
  handleSearchFocus: function () {
    this.setData({ isSearch: true });
  },
  handleSearchCancel: function () {
    this.setData({ isSearch: false });
    this.setData({ searchSongs: [] });
  },
  handleSearchChange: function (event) {
    const searchValue = event.detail;
    this.setData({ searchValue });
    if (searchValue.length <= 0) return;
    getSuggestSearch(searchValue).then((res) => {
      if (!res.result) return;
      const result = res.result;
      const order = res.result.order;
      let suggestSongs = [];
      for (const type of order) {
        const typeResult = result[type];
        suggestSongs = suggestSongs.concat(typeResult);
      }
      this.setData({
        suggestSongs: suggestSongs,
      });
    });
  },
// 点击热门标签
  handleTagClick: function (event) {
    const value = event.target.dataset.value;
    this.setData({ searchValue: value }, () => {
      this.handleSearchAction();
    });
  },
  // 点击搜索建议
  handleItemSelect: function (event) {
    const name = event.currentTarget.dataset.name;
    this.setData(
      {
        searchValue: name,
      },
      () => {
        this.handleSearchAction();
      }
    );
  },

// 点击搜索结果
  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index;
    const item = event.currentTarget.dataset.item;

    playerStore.setState("playSongList", this.data.searchSongs);
    playerStore.setState("playSongIndex", index);
    wx.navigateTo({
      url: "/pages/music-player/music-player?id=" + item.id,
    });
  },
});
