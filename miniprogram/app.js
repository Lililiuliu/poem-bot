// develop by Wang Zhen 
// wechat:timepill
// tel:18633908113

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'poem-bot-ggcfz',
        traceUser: true,
      })
    }
    this.globalData = {}
  }
})
