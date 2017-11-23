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
    voteid: '',  //投票活动的id号
    title: '', //投票标题
    description: '',//补充描述
    tempUnique: 2,//每添加一次选项，tempUnique+1,防止删除选项时造成重复
    optionData: [
      { unique: 0, content: '', number: 0, percent: 0, joiner: [] },
      { unique: 1, content: '', number: 0, percent: 0, joiner: [] }
    ],
    date: '', //投票截止日期
    time: '', //投票截止时间
    noName: 'false',  //匿名投票
    radio: 0,   //单选还是多选
  },
  onLoad: function () {
    var that = this;
    that.setData({
      date: utils.year + '-' + ('0' + utils.month).substr(-2) + '-' + ('0' + utils.date).substr(-2),
      time: ('0' + utils.hours).substr(-2) + ':' + ('0' + utils.minutes).substr(-2)
    })
  },
  bindTitleInput: function (e) {
    var that = this;
    that.setData({
      title: e.detail.value,
    });
  },
  bindDescribeInput: function (e) {
    var that = this;
    that.setData({
      description: e.detail.value,
    });
  },
  addOption: function (e) {
    var that = this;
    var tempUnique0 = that.data.tempUnique;
    var optionData0 = that.data.optionData;
    optionData0.push({ unique: tempUnique0, content: '', number: 0, percent: 0, joiner: [] })
    tempUnique0++;
    that.setData({
      tempUnique: tempUnique0,
      optionData: optionData0
    })
  },
  reduceOption: function (e) {
    var that = this;
    var optionData0 = that.data.optionData;
    for (var i = 0; i < optionData0.length; i++) {
      if (optionData0[i].unique == e.target.dataset.unique) {
        optionData0.splice(i, 1)
        that.setData({
          optionData: optionData0
        })
        return false;
      }
    }
  },
  bindBlur: function (e) {
    var that = this;
    var optionData0 = that.data.optionData;
    for (var i = 0; i < optionData0.length; i++) {
      if (optionData0[i].unique == e.target.dataset.unique) {
        optionData0[i].content = e.detail.value;
        that.setData({
          optionData: optionData0
        })
        return false;
      }
    }
  },
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value,
    })
  },
  bindTimeChange: function (e) {
    var that = this;
    that.setData({
      time: e.detail.value,
    })
  },
  switchChange: function (e) {
    var that = this;
    that.setData({
      noName: e.detail.value,
    })
  },
  radioChange: function (e) {
    var that = this;
    that.setData({
      radio: e.detail.value + '',
    })
  },
  ok: function () {
    var that = this;
    if (that.data.title == '') {
      wx.showModal({
        title: '警告!',
        content: '投票标题必需填写',
        success: function (res) {

        }
      })
    } else {
      wx.showLoading({
        title: '创建中...',
      })
      that.setData({
        voteid: new Date().getTime().toString() + parseInt(Math.random() * 10000000)//创建时间+随机数
      })
      wx.request({
        url: app.globalData.host + '/application/vote/createVoteTask.php',
        data: {
          openid: app.globalData.openid,  //openid对应voteid
          voteid: that.data.voteid,
          title: that.data.title,
          description: that.data.description,
          optionData: JSON.stringify(that.data.optionData),//json转换为字符串
          date: that.data.date, //活动日期
          time: that.data.time, //活动时间
          noName: that.data.noName,
          radio: that.data.radio,
        },
        dataType: 'JSONP',
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          wx.redirectTo({
            url: '../choose/choose?voteid=' + that.data.voteid
          })
        }
      });
    }
  }
})