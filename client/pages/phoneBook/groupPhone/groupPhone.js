var app = getApp()
Page({
  data: {
    showMessage:true,
    gId: '',
    phoneList: [],
    detailInfor: '',
    detailShow: false,
  },
  onLoad: function (opt) {
    app.globalData.fromClickId = opt.fromClickId
    if (app.globalData.enterGId) {
      this.setData({ showMessage: false})
      this.requestPhoneList(app.globalData.enterGId);
    } else {
      app.groupPhoneGIdReadyCallback = (gId) => { //获取gId下的人员头像、姓名、号码、地址
        this.setData({
          gId,
          showMessage: false
        })
        this.requestPhoneList(gId)
      }
    }
  },
  onShow: function () {
    if (app.globalData.enterGId) {
      this.requestPhoneList(app.globalData.enterGId)
    }
  },
  requestPhoneList: function (gId) {
    wx.request({
      url: app.globalData.host + '/application/phoneBook/getGIdPhoneBook.php',
      data: {
        gId
      },
      dataType: 'JSONP',
      success: (res) => {
        this.setData({
          phoneList: JSON.parse(res.data)
        })
      }
    })
  },
  showDetail: function (e) {
    let phoneList = this.data.phoneList
    for (let i = 0; i < phoneList.length; i++) {
      if (e.currentTarget.dataset.id == phoneList[i].id) {
        this.setData({
          detailInfor: phoneList[i],
          detailShow: true
        })
      }
    }
  },
  close: function () {
    this.setData({
      detailShow: false
    })
  },
  uploadInfor: function () {
    wx.navigateTo({
      url: '../uploadInfor/uploadInfor'
    })
  }
}) 
