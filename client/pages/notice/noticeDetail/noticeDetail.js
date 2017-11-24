var app = getApp()
Page({
  data: {
    noticeid: '',
    baseData: '',
    year: '',
    viewer: '',
  },
  onLoad: function (opt) {
    app.globalData.fromClickId = opt.fromClickId
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.request({  //请求群通知任务的详情数据
      url: app.globalData.host + '/application/notice/getNoticeTask.php',
      data: { noticeid: opt.noticeid },
      dataType: 'JSONP',
      success: (res) => {
        this.setData({
          noticeid: opt.noticeid,
          baseData: JSON.parse(res.data)[0],
          year: JSON.parse(res.data)[0].date.substring(0, 4)
        })
        this.storeViewer(opt.noticeid, app.globalData.openid);
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      path: '/pages/notice/noticeDetail/noticeDetail?noticeid=' + that.data.noticeid + '&fromClickId=' + app.globalData.clickId,
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (!shareTickets) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              url: app.globalData.host + '/application/link/wx_xcx.php',
              data: {
                appid: app.globalData.AppID,  //小程序ID
                sessionKey: app.globalData.session_key,
                encryptedData: encryptedData,
                iv: iv
              },
              dataType: 'JSONP',
              success: function (res) {
                var GId = JSON.parse(res.data.substring(res.data.indexOf('{'), res.data.lastIndexOf('}') + 1)).openGId;
                wx.request({
                  url: app.globalData.host + '/application/notice/storeNoticeGId.php',
                  data: {
                    gid: GId,
                    noticeid: that.data.noticeid,
                  },
                  dataType: 'JSONP',
                  success: function (res) {}
                });
              }
            });
          }
        })
      }
    }
  },
  storeViewer: function (noticeid, openid) {
    wx.request({
      url: app.globalData.host + '/application/notice/storeViewerInfor.php',
      data: {
        noticeid,
        openid
      },
      dataType: 'JSONP',
      success: (res) => {
        this.getAllViewer(noticeid)
      }
    })
  },
  getAllViewer: function (noticeid) {
    wx.request({
      url: app.globalData.host + '/application/notice/getAllViewer.php',
      data: {
        noticeid,
      },
      dataType: 'JSONP',
      success: (res) => {
        this.setData({
          viewer: JSON.parse(res.data)
        })
      }
    })
  },
})