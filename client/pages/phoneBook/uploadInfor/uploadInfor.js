var app = getApp()
Page({
  data: {
    name: '',
    tel: '',
    address: '',
    remark: '',
  },
  onLoad: function (opt) {
    if (app.globalData.userInfo) {
      this.setData({
        name: app.globalData.userInfo.nickName,
      })
    } else {
      app.getUserInfo((res) => {
        this.setData({
          name: res.nickName,
        })
      })
    }
  },
  bindAddressInput: function (e) {
    this.setData({
      address: e.detail.value,
    });
  },
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },
  bindTelInput: function (e) {
    var that = this;
    that.setData({
      tel: e.detail.value,
    });
  },
  bindRemarkInput: function (e) {
    var that = this;
    that.setData({
      remark: e.detail.value,
    });
  },
  getMap: function () {
    var that = this;
    var chooseAddress = function () {
      wx.chooseLocation({
        type: 'gcj02', 
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          that.setData({
            address: res.name + '(' + res.address + ')'
          })
        }
      })
    }
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] == false) {
          wx.openSetting({
            success: (res) => {
              chooseAddress()
            }
          })
        } else {
          chooseAddress()
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    wx.request({
      url: app.globalData.host + '/application/link/wx_xcx.php',
      data: {
        appid: app.globalData.AppID,  //小程序ID
        sessionKey: app.globalData.session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      dataType: 'JSONP',
      success:(res)=> {
        //必须是真机和已发布的appid才能请求成功！
        let tel = JSON.parse(res.data.substring(res.data.indexOf('{'), res.data.lastIndexOf('}') + 1)).phoneNumber;
        this.setData({
          tel
        })
      }
    })
  },
  ok: function () {
    if (this.data.tel == '') {
      wx.showModal({
        title: '警告!',
        content: '手机号码必须填写',
      })
    } else if (this.data.name == ''){
      wx.showModal({
        title: '警告!',
        content: '姓名必须填写',
      })
    }else {
      wx.showLoading({
        title: '创建中...',
      })
      wx.request({
        url: app.globalData.host + '/application/phoneBook/uploadInfor.php',
        data: {
          openid: app.globalData.openid, 
          name: this.data.name,
          tel: this.data.tel,
          address: this.data.address,
          remark: this.data.remark,
          gId: app.globalData.enterGId,
        },
        dataType: 'JSONP',
        success: function (res) {
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        }
      });
    }
  }
})