/*-----------------------------------------点击表---------------------------------*/
//此函数能够获取到clickId(点击表的id，自动生成)、appId(小程序ID)、openId(用户ID)、scene(场景值)、fromClickId(从哪里转发来的，第一次没有)、fromGId(从哪个群打开的，可以为空)、time(打开时间)，并存储在app.globalData对象和数据库点击表中
//参数app指的是该微信小程序，该函数调用时，app就用this
//参数opt指的是打开该小程序获取的数据
let getUserNetwork = (app, opt) => {
  //检查globalData中是否包含必要的参数
  console.log(app.globalData.AppID || app.globalData.appId ? '【onShareAppMessage】：appId就绪' : '【onShareAppMessage错误】：app.globalData中必需包含appId！')
  console.log(app.globalData.secret ? '【onShareAppMessage】：secret就绪' : '【onShareAppMessage错误】：app.globalData中必需包含secret！')
  wx.login({
    success: (res) => { //登录成功
      if (res.code) {
        wx.request({
          url: 'https://test.hytips.com/wechat/ForexWeb1/forex_require_url.php',
          data: {
            appid: app.globalData.AppID || app.globalData.appId,
            secret: app.globalData.secret,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          dataType: 'JSONP',
          success: (res) => {  //服务端请求并存储openid,并发送openid过来
            let data0 = JSON.parse(res.data);
            app.globalData.openid = data0.openid;
            let finalData = {
              appId: app.globalData.AppID || app.globalData.appId,
              openId: data0.openid,
              scene: opt.scene,
              fromClickId: app.globalData.fromClickId,
              fromGId: ''
            }
            wx.getShareInfo({
              shareTicket: opt.shareTicket,
              success: (res) => {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
                wx.request({
                  url: app.globalData.serverAddress + '/students/link/wx_xcx.php',  //放fromGID解密的地址
                  data: {
                    appid: app.globalData.AppID || app.globalData.appId,  //小程序ID
                    sessionKey: data0.session_key,
                    encryptedData,
                    iv
                  },
                  dataType: 'JSONP',
                  success: (res) => {
                    var fromGId = JSON.parse(res.data.substring(res.data.indexOf('{'), res.data.lastIndexOf('}') + 1)).openGId;
                    finalData.fromGId = fromGId;
                    storeDataIntoClickTable(app, finalData)
                  }
                });
              },
              fail: function (res) {
                storeDataIntoClickTable(app, finalData)
              }
            })
          }
        })
      }
    }
  });
  let storeDataIntoClickTable = (app, data) => { //将最后的数据存储到点击表
    wx.request({
      url: 'https://test.hytips.com/wechat/userNetwork/WXClickDeal.php',
      data: {
        appId: data.appId,
        openId: data.openId,
        scene: data.scene,
        fromGId: data.fromGId,
        fromClickId: data.fromClickId,
      },
      dataType: 'JSONP',
      success: (res) => {
        let clickId = JSON.parse(res.data).clickId
        app.globalData.clickId = clickId;
        console.log(' 存储finalData和clickId', data, clickId)
      }
    });
  }
}

module.exports.getUserNetwork = getUserNetwork