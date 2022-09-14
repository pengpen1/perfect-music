Component({
    properties:{
        songItem:{
            type:Object,
            value:{}
        }
    },
    methods:{
        onSongItemClick(){
          const id =this.properties.songItem.id
          wx.navigateTo({
            url: `/pages/music-player/music-player?id=${id}`,
          })
        }
    }
})