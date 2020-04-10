//index.js
const app = getApp()
var cloud = require('../../utils/cloud.js');
const db = wx.cloud.database()

Page({

  data: {
    p: 1,
    reachbottom: true,
    isloading: false,
    load: false,
    poemsList: []
  },

  // 点击写诗按钮
  test: function (e) {
    wx.showLoading({
      title: '登录中',
    })
    var sign = wx.getStorageSync('sign')
    if (!sign) {
      wx.cloud.callFunction({
        name: 'getuserinfo',
        data: {
          userinfo: wx.cloud.CloudID(e.detail.cloudID)
        }
      }).then(res => {
        console.log(res)
        let sign = res.result.userinfo.data.nickName
        wx.setStorageSync('sign', sign)
        wx.navigateTo({
          url: '../write/write?sign=' + sign,
          success: () => {
            wx.hideLoading()
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
        }
      })
    }
  },

  // 获取列表数据
  getList: function (type, callback) {
    switch (type) {

      //下拉刷新
      case 'down':
        db.collection('poem').orderBy('poem.createtime', 'desc').skip(0).limit(5).get().then(res => {
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
        db.collection('poem').orderBy('poem.createtime', 'desc').skip(skip * 5).limit(2).get().then(res => {

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

  taplistitem:function(e){
    var poem = e.currentTarget.dataset.poem
    wx.navigateTo({
      url: '../read/read',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: poem })
      }
    })
  },

  onLoad: function () {
    this.getList('down')
  },

  onPullDownRefresh() {
    this.getList('down', () => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom: function () {
    var p = this.data.p
    if (this.data.load) {
      this.getList('up')
    }
  }
})