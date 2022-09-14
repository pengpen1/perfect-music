// app.js
App({
  globalData:{
		screenWidth:375,
		screenHeight:667,
        statusHeight:20,
        //因为自定义了导航栏，所以这里需要计算一下
        contentHeight:500
	},
	onLaunch(){
		// 1.获取设备信息
		wx.getSystemInfo({
			success: (result) => {
				this.globalData.screenHeight = result.screenHeight
				this.globalData.screenWidth = result.screenWidth
                this.globalData.statusHeight = result.statusBarHeight
                this.globalData.contentHeight = result.screenHeight - result.statusBarHeight -44
			},
		})
	}
})
