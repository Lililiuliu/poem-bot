// pages/write/write.js

var util = require('../../utils/util.js');
const db = wx.cloud.database()

Page({
  data: {
    poem: {
      title: '',
      content: '',
      sign: '',
      createtime: Date
    },
    dialog: false
  },

  // 获取标题
  inputtilte: function (e) {
    this.setData({
      'poem.title': e.detail.value
    })
  },

  // 获取正文
  inputcontent: function (e) {
    this.setData({
      'poem.content': e.detail.value
    })
  },

  // 关闭署名编辑对话框
  close: function () {
    this.setData({
      dialog: false
    });
  },
 
  // 打开署名编辑对话框
  open() {
    this.setData({
        dialog: true
    });
  },

  // 获取当前时间
  setDate: function () {
    let now = Date.now()
    let displaytime = util.formatTimeTwo(now, 'Y.M.D')
    this.setData({
      'poem.createtime': now,
      'poem.displaytime': displaytime
    })
  },

  // 编辑署名
  setSign: function () {
    let sign = this.data.editsign

    if (sign){
      this.setData({
        'poem.sign':sign,
        dialog: false
      })
    }
    else {
      wx.showToast({
        title: '请输入署名或选择匿名',
        icon:'none'
      })
    }
    
  },

  // 获取署名
  getSign:function(e){
    this.setData({
      editsign:e.detail.value,
    })
  },

  // 设置为匿名
  anonymous:function(){
    this.setData({
      'poem.sign':'',
      editsign:'匿名',
      dialog:false
    })
  },

  send:function(){
    wx.showLoading({
      title: '发表中...',
    })
    var poem = this.data.poem
    if(poem.content){
      db.collection('poem').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          poem
        }
      })
      .then(res => {
        wx.showToast({
          title: '发表成功！',
          icon:'success',
          duration:1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      })
      .catch(res => {
        wx.showToast({
          title:'发表失败，请稍后再试',
          icon:'none'
        })
      })
    }
    else {
      wx.showToast({
        title: '请写完再发表您的诗',
        icon:'none'
      })
    }

  },

  onLoad: function (options) {
    const sign = options.sign
    // 设置署名
    this.setData({
      'poem.sign': sign,
      editsign:sign
    })
    //设置显示时间
    this.setDate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})