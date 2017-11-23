var app = getApp()
Page({
  data: {
    currentTab: 0,
    joinData: '',
    createData: '',
    groupData: '',
  },
  onLoad: function () {
    if (app.globalData.openid) {
      this.getOpenIdData(app.globalData.openid);
    } else {
      app.noticeOpenIdReadyCallback = (openid) => {
        this.getOpenIdData(openid);
      }
    }
    if (app.globalData.enterGId) {
      this.getGIdData(app.globalData.enterGId);
    } else {
      app.noticeGIdReadyCallback = (gid) => {
        this.getGIdData(gid);
      }
    }
  },
  onShow: function () {
    if (app.globalData.openid) {
      this.getOpenIdData(app.globalData.openid);
    }
    if (app.globalData.enterGId) {
      this.getGIdData(app.globalData.enterGId);
    }
  },
  getOpenIdData: function (openid) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({  //请求我参加的通知
      url: app.globalData.host + '/application/notice/myView.php',
      data: {
        openid,
      },
      dataType: 'JSONP',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          joinData: JSON.parse(res.data)
        })
      }
    });
    wx.request({  //请求我创建的通知列表
      url: app.globalData.host + '/application/notice/myCreate.php',
      data: {
        openid,
      },
      dataType: 'JSONP',
      success: function (res) {
        that.setData({
          createData: JSON.parse(res.data)
        })
      }
    });
  },
  getGIdData: function (gid) {
    var that = this;
    wx.request({  //请求该群的noticeid数据列表
      url: app.globalData.host + '/application/notice/getGIDTask.php',
      data: {
        gid,
      },
      dataType: 'JSONP',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          groupData: JSON.parse(res.data)
        })
      }
    });
  },
  swichNav: function (e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current,
    })
  },
  creat: function () {
    var that = this;
    wx.navigateTo({
      url: '../create/create'
    })
  },
  gotoEnroll: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../noticeDetail/noticeDetail?noticeid=' + e.currentTarget.dataset.noticeid
    })
  }
})