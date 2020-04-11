const db = wx.cloud.database()
Page({

  data: {
    p: 1,
    reachbottom: true,
    isloading: false,
    load: false,
    poemsList: []
  },

  getList: function (openid, type, callback) {
    switch (type) {

      //下拉刷新
      case 'down':
        db.collection('poem').where({_openid: openid}).orderBy('poem.createtime', 'desc').skip(0).limit(5).get().then(res => {
          this.setData({
            poemsList: res.data,
            load: true,
            p: 1,
            reachbottom: false
          })
          callback && callback()
        })
        break;

        //分页加载
      case 'up':
        this.setData({
          isloading: true
        })
        var skip = this.data.p
        db.collection('poem').where({_openid: openid}).orderBy('poem.createtime', 'desc').skip(skip * 5).limit(2).get().then(res => {

          if (res.data.length != 0) {
            var poemsList = this.data.poemsList.concat(res.data)
            console.log(poemsList)
            this.setData({
              poemsList,
              isloading: false,
              load: true,
              p: skip + 1
            })
          } else {
            this.setData({
              reachbottom: true,
              isloading: false,
              load: true,
            })
          }
        })
        break;
    }
  },

  taplistitem: function (e) {
    var poem = e.currentTarget.dataset.poem
    wx.navigateTo({
      url: '../read/read',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: poem
        })
      }
    })
  },

  onLoad: function (options) {
    var openid = options.openid
    this.setData({
      openid
    })
    this.getList(openid, 'down')
  },

  onShow:function() { 
    const openid = wx.getStorageSync('openid')
    this.getList(openid, 'down')
  },

  onPullDownRefresh() {
    this.getList(this.data.openid, 'down', () => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom: function () {
    if (this.data.load) {
      this.getList(this.data.openid, 'up')
    }
  }
})