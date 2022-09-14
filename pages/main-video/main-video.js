// pages/main-video/main-video.js

import { pqrequest } from "../../services/request/index";
import { getVideoList } from "../../services/video";

Page({
  data: {
    videoList: [],
    currentOffset: 0,
    currentLimit: 20,
    hasMore: true,
  },
  onLoad() {
    // 1.网络请求
    this.fetchVideoList();
  },
  async fetchVideoList() {
    const limit = this.data.currentLimit;
    const offset = this.data.currentOffset;
    const videoRes = await getVideoList(limit, offset);
    // 1.不要动原来的状态，保证不可变性更新
    this.setData({
      videoList: [...this.data.videoList, ...videoRes.data],
      currentOffset: offset + limit,
      // 2.因为只能请求50条，所以加个hasMore的限制
      hasMore: videoRes.hasMore,
    });
  },
  // 上拉加载更多功能
  onReachBottom() {
    // 如果hasMore不为true则不请求
    if (!this.data.hasMore) return;

    this.fetchVideoList();
  },
  // 下拉刷新功能
  async onPullDownRefresh() {
    // 1.清空数据
    this.setData({
      videoList: [],
      currentOffset: 0,
      hasMore: true,
    });
    // 2.重新请求
    await this.fetchVideoList();
    // 3.网络请求成功后关闭下拉刷新
    wx.stopPullDownRefresh();
  },
   //  事件回调
  onTapVideoItem(e){
   const id =e.currentTarget.dataset.item.id
   wx.navigateTo({
     url: `/packageVideo/pages/detail-video/detail-video?id=${id}`,
   })

  }
});
