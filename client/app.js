/*
  ·原则上appid、secret、openid、session_key、enterGId这些敏感数据不要存在前端，而是后端请求到数据后生成自营session发往前端，但是由于更熟悉JS，暂时先不考虑
  ·腾讯自己封装了SDK，可直接用他们的服务器管理会话机制：https://github.com/tencentyun/wafer-client-sdk
  ·结合openid和群id，生成小程序的用户关系网
*/
const getUserNetwork = require('utils/shareModule.js').getUserNetwork; //引入用户关系网追踪模块
const host = 'http://192.168.0.100'
App({
  globalData: {
    host,
    AppID: 'wx8f14d85e38a5e092',
    secret: 'e15db9aaff28bcd7f2091613a43fd914',
    openid: '',
    session_key: '',
    userInfo: '',
    opt: '',
    enterGId: '',//程序启动时获取的群ID
  },
  onLaunch: function (opt) {
    this.globalData.opt = opt;
    this.login();
  },
  login: function () {
    wxLogin()
      .then(wxLogin)
      .then(getOpenId)
      .then(getGId)
      .then(gIdCallback)
    const that = this;
    function wxLogin() {
      return new Promise((resolve, reject) => {
        wx.login({
          success: (res) => {
            resolve(res)
          }
        });
      })
    }
    function getOpenId(res) {
      return new Promise((resolve, reject) => {
        if (res.code) {
          wx.request({
            url: `${that.globalData.host}/application/link/forex_require_url.php`,
            data: {
              appid: that.globalData.AppID,
              secret: that.globalData.secret,
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            dataType: 'JSONP',
            success: (res) => {  //服务端请求并存储openid,并发送openid过来
              resolve(res)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      })
    }
    function getGId(res) {
      return new Promise((resolve, reject) => {
        let data0 = JSON.parse(res.data);
        that.globalData.openid = data0.openid;
        that.globalData.session_key = data0.session_key;
        getUserNetwork(that, that.globalData.opt) //将用户及群关系存储到数据库
        if (that.noticeOpenIdReadyCallback) { //群通知页面定义app.noticeOpenIdReadyCallback实现回调
          that.noticeOpenIdReadyCallback(data0.openid)
        }
        that.getUserInfo();//用户授权，并存储用户信息
        if (that.globalData.opt.scene == '1044') {  //获取转发的GID
          wx.getShareInfo({ /*小程序群里打开获取群信息模块 */
            shareTicket: that.globalData.opt.shareTicket,
            success: (res) => {
              wx.request({
                url: `${that.globalData.host}/application/link/wx_xcx.php`,
                data: {
                  appid: that.globalData.AppID,
                  sessionKey: data0.session_key,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                dataType: 'JSONP',
                success: (res) => {
                  resolve(res)
                }
              });
            }
          })
        }
      })
    }
    function gIdCallback(res) {
      let GId = JSON.parse(res.data.substring(res.data.indexOf('{'), res.data.lastIndexOf('}') + 1)).openGId;
      that.globalData.enterGId = GId;
      if (that.groupPhoneGIdReadyCallback) {
        that.groupPhoneGIdReadyCallback(GId)
      }
      if (that.noticeGIdReadyCallback) {
        that.noticeGIdReadyCallback(GId)
      }
    }
  },
  getUserInfo: function (cb) {
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: (res) => {
          this.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(this.globalData.userInfo)
          this.storeuserInfo();
        },
        fail: () => {
          this.getAuthorize();
        }
      })
    }
  },
  getAuthorize: function () { //打开设置，让用户进行授权
    wx.showModal({
      title: '登录失败!',
      content: '您刚才拒绝了登录，请选择允许获取用户公开信息',
      success: (res) => {
        wx.openSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: (res) => {
                  this.globalData.userInfo = res.userInfo;
                  this.storeuserInfo();
                },
              })
            } else {
              this.getAuthorize();
            }
          }
        })
      }
    })
  },
  storeuserInfo: function () {  //将登陆的用户详情信息存储到数据库
    let userInfo = this.globalData.userInfo
    wx.request({
      url: `${this.globalData.host}/application/link/wxuserDataSave.php`,
      data: {
        openid: this.globalData.openid,  //用户唯一标识
        avatarUrl: userInfo.avatarUrl,//用户信息：图像
        city: userInfo.city,//用户信息：所在城市
        gender: userInfo.gender,//用户信息：性别。0:未知，1：男，2：女
        language: userInfo.language,//用户信息：语言
        nickName: userInfo.nickName,//用户信息：姓名
        province: userInfo.province,//用户信息：省份
      },
      dataType: 'JSONP',
      success: (res) => {}
    });
  },
})
