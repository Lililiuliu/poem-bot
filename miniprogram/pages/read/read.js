const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poem: {},
    ismy: false,
    dialog: false
  },

  // 点击删除按钮
  tapDelete: function () {
    this.setData({
      dialog: true
    })
  },

  // 关闭删除对话框
  close: function () {
    this.setData({
      dialog: false
    });
  },

  // 删除操作
  delete: function () {
    const peomid = this.data.poem._id
    const that = this
    this.setData({
      dialog: false
    })
    wx.showLoading({
      title: '正在删除',
    })
    db.collection('poem').doc(peomid).remove({
      success: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      },
      fail: function () {
        wx.showToast({
          title: '删除失败，请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  // 复制内容
  copy: function () {
    const poem = this.data.poem.poem.title + "\n" + this.data.poem.poem.sign + " | " + this.data.poem.poem.displaytime + "\n" + this.data.poem.poem.content
    wx.setClipboardData({
      data: poem
    })
  },

  // 点击信息 
  tapInfo:function(){
    var openid = this.data.poem._openid
    var sign = this.data.poem.poem.sign
    wx.navigateTo({
      url: '../poetpage/poetpage?openid='+openid +'&sign='+sign,
    })

  },

  onLoad: function () {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        poem: data.data
      })
    })
    const myopenid = wx.getStorageSync('openid')
    if (myopenid === this.data.poem._openid) {
      this.setData({
        ismy: true
      })
    }
  },
})