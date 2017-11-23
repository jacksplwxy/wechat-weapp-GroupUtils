const app = getApp()  //获取小程序实例(必要)
Page({
  data: {
    avatarUrl:'',
    nickName:'',
  },
  onLoad: function (opt) {
    app.globalData.fromClickId = opt.fromClickId //获取从哪个点击序列号打开的(必要)
    wx.showShareMenu({  //定义转发时携带shareTicket (必要)
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
      path: 'pages/phoneBook/groupPhone/groupPhone',
      success: res => {
        console.log('转发成功！')
      }
    }
  },
}) 