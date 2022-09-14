import { getSongDetail, getSongLyric } from "../../services/player";
import { throttle } from "underscore";
import { parseLyric } from "../../utils/parse-lyric";

// 创建播放器
const audioContext = wx.createInnerAudioContext();

Page({
  data: {
    //   初始化页面用的值
    id: "",
    currentSong: {},
    currentLyricInfos: {},
    currentLyricText:'',
    currentLyricIndex:-1,
    lyricScrollTop:0,

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
    //   1.获取id
    const id = options.id;
    this.setData({
      id,
    });

    // 2.根据id网络请求
    this.fetchCurrentSong(this.data.id);
    this.fetchSongLyric(this.data.id);

    // 3.拿到app实例保存的静态数据
    const app = getApp();
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight,
    });

    // 4.播放当前歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`;
    // 等播放器缓存好准备好后，自动播放
    audioContext.autoplay = true;

    // 监听播放进度,做了节流处理
    const throttleUpdateProgress = throttle(this.updateProgress, 500, {
      leading: false,
      trailing:false
    });
    audioContext.onTimeUpdate(() => {
      // 滑动时就不要设置了，不然反复横跳
      if (!this.data.isSliderChanging) {
        throttleUpdateProgress();
      }

      // 匹配正确的歌词
      const infos = this.data.currentLyricInfos
      if(!infos.length) return
      let currentIndex = infos.length - 1
      for (let index = 0; index < infos.length; index++) {
        const info = infos[index]
        if( info.time > audioContext.currentTime * 1000){
          currentIndex =  index -1
          break
        }    
      }

      if(currentIndex === this.data.currentLyricIndex) return
      this.setData({
        currentLyricText:infos[currentIndex].text,
        lyricScrollTop: currentIndex * 35,
        currentLyricIndex:currentIndex
      })
    });

    //处理跳转后的暂停bug
    audioContext.onWaiting(() => {
      audioContext.pause();
    });
    audioContext.onCanplay(() => {
      audioContext.play();
    });
  },
  //   网络请求
  async fetchCurrentSong(ids) {
    const detailRes = await getSongDetail(ids);
    this.setData({
      currentSong: detailRes.songs[0],
      durationTime: detailRes.songs[0].dt,
    });
  },
  async fetchSongLyric(id) {
    const lyricRes = await getSongLyric(id);
    // 处理单行歌词
    const currentLyricInfos = parseLyric(lyricRes.lrc.lyric);
    this.setData({
      currentLyricInfos,
    });
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
    });
    this.data.isSliderChanging = false;
  },
  onSliderChanging(event) {
    // 拖到过程中触发
    const currentValue = event.detail.value / 100;
    const skipTime = currentValue * this.data.durationTime;
    this.setData({
      currentTime: skipTime,
    });
    this.data.isSliderChanging = true;
  },
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause();
      this.setData({
        isPlaying: false,
      });
    } else {
      audioContext.play();
      this.setData({
        isPlaying: true,
      });
    }
  },
  updateProgress() {
    this.setData({
      // 1.改变currentTime
      currentTime: audioContext.currentTime * 1000,
      // 2.计算滑快位置,10相当于百分之十，所以小数要乘以100
      sliderValue: Math.floor(
        ((audioContext.currentTime * 1000) / this.data.durationTime) * 100
      ),
    });
  },
});
