var app = getApp()
Page({
  data: {
    currentTab: 0,
    joinData: '',
    createData: '',
    groupData: ''
  },
  onShow: function () {
    var that = this;
    that.updateData();
  },
  updateData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({  //请求我参加的接龙列表
      url: app.globalData.host + '/application/link/myJoin.php',
      data: {
        openid: app.globalData.openid,
      },
      dataType: 'JSONP',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          joinData: JSON.parse(res.data)
        })
      }
    });
    wx.request({  //请求我创建的接龙列表
      url: app.globalData.host + '/application/link/myCreate.php',
      data: {
        openid: app.globalData.openid,
      },
      dataType: 'JSONP',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          createData: JSON.parse(res.data)
        })
      }
    });
    wx.request({  //请求该群的taskid数据列表
      url: app.globalData.host + '/application/link/getGIDTask.php',
      data: {
        gid: app.globalData.enterGId,
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
      url: '../enroll/enroll?taskid=' + e.currentTarget.dataset.taskid
    })
  }
})