const db = wx.cloud.database()
Page({

  data: {
    p: 1,
    reachbottom: true,
    isloading: false,
    load: false,
    poemsList: [],
    notice: {
      show: true,
      days: '',
      new: false
    }
  },

  getList: function (openid, type, callback) {
    switch (type) {

      //下拉刷新
      case 'down':
        db.collection('poem').where({
          _openid: openid
        }).orderBy('poem.createtime', 'desc').skip(0).limit(5).get().then(res => {
          if (res.data.length != 0) {
            var start = res.data[0].poem.createtime // 获取最新一首诗的创作时间
            var end = Date.now() // 获取当前时间
            var days = Math.floor((end - start) / (24 * 60 * 60 * 1000)) //转换为天，取整
            var show = (days > 3) ? true : false // 3天以上显示
            this.setData({
              poemsList: res.data,
              load: true,
              p: 1,
              reachbottom: false,
              'notice.show': show,
              'notice.days': days
            })
          } else {
            var nopoem = true
            this.setData({
              'notice.new':nopoem
            }) 
          }
          callback && callback()
        })
        break;

        //分页加载
      case 'up':
        this.setData({
          isloading: true
        })
        var skip = this.data.p
        db.collection('poem').where({
          _openid: openid
        }).orderBy('poem.createtime', 'desc').skip(skip * 5).limit(5).get().then(res => {

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

  // 点击写诗按钮
  tapWrite: function (e) {
    wx.showLoading({
      title: '登录中',
    })
    var sign = wx.getStorageSync('sign')
    var openid = wx.getStorageSync('openid') 
    if (!sign || !openid) {
      wx.cloud.callFunction({
        name: 'getuserinfo',
        data: {
          userinfo: wx.cloud.CloudID(e.detail.cloudID)
        }
      }).then(res => {
        console.log(res)
        let sign = res.result.userinfo.data.nickName
        let openid = res.result.userInfo.openId
        wx.setStorageSync('sign', sign)
        wx.setStorageSync('openid', openid)
        wx.navigateTo({
          url: '../write/write?sign=' + sign,
          success: () => {
            wx.hideLoading()
            this.setData({
              'notice.show':false,
              'notice.new':false
            })
          }
        })
      }).catch(err => {
        throw err
      })
    }
    else {
      wx.navigateTo({
        url: '../write/write?sign=' + sign,
        success: () => {
          wx.hideLoading()
          this.setData({
            'notice.show':false,
            'notice.new':false
          })
        }
      })
    }
  },

  close:function(){
    this.setData({
      'notice.show':false,
      'notice.new':false
    })
  },

  onLoad: function (options) {
    var openid = options.openid
    this.setData({
      openid
    })
    this.getList(openid, 'down')
  },

  onShow: function () {
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