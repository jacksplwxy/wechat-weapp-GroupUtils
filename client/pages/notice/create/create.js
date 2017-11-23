var utils = (function () {
  var time = new Date()
  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    date: time.getDate(),
    hours: time.getHours(),
    minutes: time.getMinutes()
  }
})()
var app = getApp()
Page({
  data: {
    noticeid:'',
    date:'',
    fileNumber:'000',
    title:'',
    description:'',
    name:'',
    year:'',
  },
  onLoad: function () {
    this.setData({
      date: utils.year + '年' + utils.month + '月' + utils.date+'日',
      year: utils.year,
      name: app.globalData.userInfo.nickName
    })
  },
  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value,
    });
  },
  bindDescribeInput: function (e) {
    this.setData({
      description: e.detail.value,
    });
  },
  bindFileNumberInput: function (e) {
    this.setData({
      fileNumber: e.detail.value,
    });
  },
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },
  ok: function () {
    var that = this;
    if (that.data.title == '') {
      wx.showModal({
        title: '警告!',
        content: '投票标题必需填写',
      })
    } else if (that.data.description == ''){
      wx.showModal({
        title: '警告!',
        content: '通知内容必需填写',
      })
    } else {
      wx.showLoading({
        title: '创建中...',
      })
      that.setData({
        noticeid: new Date().getTime().toString() + parseInt(Math.random() * 10000000)//创建时间+随机数
      })
      wx.request({
        url: app.globalData.host + '/application/notice/createNoticeTask.php',
        data: {
          openid: app.globalData.openid, 
          noticeid: that.data.noticeid,
          title: that.data.title,
          description: that.data.description,
          date: that.data.date, 
          fileNumber: that.data.fileNumber, 
          name: that.data.name
        },
        dataType: 'JSONP',
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          wx.redirectTo({
            url: '../noticeDetail/noticeDetail?noticeid=' + that.data.noticeid
          })
        }
      });
    }
  }
})