import  { audioContext,playerStore} from "../../store/playerStore";
import { throttle } from "underscore";

const app = getApp()
const modeNames = ["order", "repeat", "random"];

Page({
  data: {
    //   初始化页面用的值
    id: "",
    currentSong: {},
    currentLyricInfos: {},
    currentLyricText: "",
    currentLyricIndex: -1,
    lyricScrollTop: 0,
    stateKeys: ["id", "currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],
    playModeName:"order",
    // 动态高度
    statusHeight: 20,
    contentHeight: 603,
    // 页面导航
    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    // 滑动选择器与控制
    sliderValue: 0,
    currentTime: 0,
    durationTime: 0,
    isSliderChanging: false,
    // 播放控制
    isPlaying: true,
  },
  onLoad(options) {
    // 0.获取设备信息
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight,
    });

    // 1.获取传入的id
    const id = options.id;

    // 2.根据id播放歌曲
    if (id) {
      playerStore.dispatch("playMusicWithSongIdAction", id);
    }

    // 3.获取store共享数据
    playerStore.onStates(["playSongList", "playSongIndex"],this.getPlaySongInfosHandler);
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler);
  },
  //   事件回调
  onNavBackTap() {
    wx.navigateBack();
  },
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentPage: index });
  },
  onSwiperChange(event) {
    const currentPage = event.detail.current;
    this.setData({
      currentPage,
    });
  },
  //   拖动条事件回调
  onSliderChange(event) {
    // 点击，或者拖到结束触发
    const currentValue = event.detail.value / 100;
    const skipTime = currentValue * (this.data.durationTime / 1000);
    
    // seek设置跳转位置，单位为秒
    audioContext.seek(skipTime);
    this.setData({
      currentTime: skipTime * 1000,
      sliderValue:currentValue * 100
    });
    this.data.isSliderChanging = false;
    playerStore.setState('isPlaying',true) 
  },
  onSliderChanging: throttle(function (event) {
    // 拖到过程中触发
    const currentValue = event.detail.value / 100;
    const skipTime = currentValue * this.data.durationTime;
    this.setData({
      currentTime: skipTime,
    });
    this.data.isSliderChanging = true;
  },100),
  onPlayOrPauseTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction")
  },
  onTapPlaylist(){
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  updateProgress: throttle(function(currentTime) {
    // if (this.data.isSliderChanging) return
    // 1.记录当前的时间 2.修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({ currentTime, sliderValue })
  }, 800, { leading: false, trailing: false }),
  getPlayerInfosHandler({ 
    id, currentSong, durationTime, currentTime,
    lyricInfos, currentLyricText, currentLyricIndex,
    isPlaying, playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({ id })
    }
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime)
    }
    if (lyricInfos) {
      this.setData({ currentLyricInfos:lyricInfos })
    }
    if (currentLyricText) {
      this.setData({ currentLyricText })
    }
    if (currentLyricIndex !== undefined) { 
      // 修改lyricScrollTop
      this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
    if (playModeIndex !== undefined) {
      this.setData({ playModeName: modeNames[playModeIndex] })
    }
  },
  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({ playSongList })
    }
    if (playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
  },
  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
  }
});
