var app = getApp()
Page({
  data: {},
  onLoad: function (opt) {
    app.globalData.fromClickId = opt.fromClickId
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShareAppMessage: function (res) {
    let insertShareInfo = (gId, clickId) => {
      wx.request({
        url: 'https://test.hytips.com/wechat/userNetwork/WXShareDeal.php',
        data: {
          clickId: clickId,
          gId,
        },
        dataType: 'JSONP',
        success: (res) => {
          console.log('成功插入一条转发记录!')
        }
      })
    }
    return {
      path: getCurrentPages()[0].route + '?fromClickId=' + app.globalData.clickId,//注意:转发其他页面路劲时需修改
      success: (res) => {
        var shareTickets = res.shareTickets
        if (!shareTickets) {
          console.log('IOS转发给个人的时候shareTickets为null', shareTickets)
          let gId = ''
          insertShareInfo(gId, app.globalData.clickId)
        } else {
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: (res) => {
              wx.request({
                url: app.globalData.serverAddress + '/students/link/wx_xcx.php',
                data: {
                  appid: app.globalData.AppID,
                  sessionKey: app.globalData.session_key,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                dataType: 'JSONP',
                success: (res) => {
                  let gId = JSON.parse(res.data.substring(res.data.indexOf('{'), res.data.lastIndexOf('}') + 1)).openGId
                  insertShareInfo(gId, app.globalData.clickId)
                }
              })
            },
            fail: (res) => {
              console.log('Android转发给个人的时候shareTickets不为null', shareTickets)
              let gId = ''
              insertShareInfo(gId, app.globalData.clickId)
            }
          })
        }
      }
    }
  }
}) 