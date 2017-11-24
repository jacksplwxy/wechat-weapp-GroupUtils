const app = getApp()  //获取小程序实例(必要)
Page({
  data: {
    avatarUrl:'',
    nickName:'',
  },
  onLoad: function (opt) {
    app.globalData.fromClickId = opt.fromClickId
    wx.showShareMenu({
      withShareTicket: true
    })
    if (app.globalData.userInfo.avatarUrl){ 
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
      })
    }else{
      app.getUserInfo((res)=>{
        this.setData({
          avatarUrl: res.avatarUrl,
          nickName: res.nickName,
        })
      })
    }
  },
  onShareAppMessage: function () {
    return {
      path: 'pages/phoneBook/groupPhone/groupPhone?fromClickId=' + app.globalData.clickId,
      success: res => {
        console.log('转发成功！')
      }
    }
  },
}) 