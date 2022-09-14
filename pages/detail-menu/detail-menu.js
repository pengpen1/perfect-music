import { getAllMenuTag, getSongMenuList } from "../../services/music";

Page({
  data: {
    allMenuList: [],
  },
  onLoad() {
    this.fetchAllMenuList();
  },
  async fetchAllMenuList() {
    // 1.获取所有菜单的标签
    const allTagRes = await getAllMenuTag();
    const tags = allTagRes.tags;
    // 2.根据标签获取歌单
    const allPromise = [];
    for (let i = 0; i < tags.length; i++) {
      allPromise.push(getSongMenuList(tags[i].name));
    }
    //  3.等获取了所有数据之后再调用setData
    Promise.all(allPromise)
      .then((res) => {
        //   数据不用降维
       this.setData({
           allMenuList:res
       })
      })
      .catch((err) => console.log(err));
  },
});
