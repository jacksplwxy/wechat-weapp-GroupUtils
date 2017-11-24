/*
说明：
  *功能介绍：
    ·该函数能够在数据库插入一条小程序启动记录(clickId),记录包含了本次小程序的启动从谁(fromClickId)那里传播过来的。
    ·数据库结构：clickId-fromClickId-appId-openId-fromGId(从哪个群启动的)-scene-time-(转发记录)
    ·通过递归遍历该数据库表，可构建一张用户（群）关系网图
    ·fromClickId这个参数是从分享的option中获取的，所以还需参考page.js中的模板完成分享页面的设置
  *注意事项：
    ·该函数必须在获取到openid之后才能调用
    ·该函数自带获取群ID的方法
    ·参数app指的是该微信小程序，该函数调用时，app就用this
    ·参数opt指的是打开该小程序获取的数据
*/
let getUserNetwork = (app, opt) => {
  //检查globalData中是否包含必要的初始化参数
  if (!(app.globalData.AppID || app.globalData.appId)){
    console.error('【onShareAppMessage错误】：app.globalData中必需包含appId！')
  }
  if (!(app.globalData.secret)){
    console.error('【onShareAppMessage错误】：app.globalData中必需包含secret！')
  }
  //定义需要存储数据库的数据
  let finalData = {
    appId: app.globalData.AppID || app.globalData.appId,
    openId: app.globalData.openid,
    scene: opt.scene,
    fromClickId: app.globalData.fromClickId,
    fromGId: ''
  }
  //判断是否是从微信群内打开该程序的
  wx.getShareInfo({
    shareTicket: opt.shareTicket,
    success: (res) => {
      wx.request({
        url: app.globalData.host + '/application/link/wx_xcx.php',  //放fromGID解密的地址
        data: {
          appid: app.globalData.AppID || app.globalData.appId,
          sessionKey: app.globalData.session_key,
          encryptedData: res.encryptedData,
          iv: res.iv
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
  //将最后的数据存储到数据库点击表中,同时将得到的clickId放在全局变量供page分享是调用
  function storeDataIntoClickTable(app, data){ 
    wx.request({
      url: 'https://test.hytips.com/wechat/userNetwork/WXClickDeal.php',
      data,
      dataType: 'JSONP',
      success: (res) => {
        let clickId = JSON.parse(res.data).clickId
        app.globalData.clickId = clickId;
        console.info('【onShareAppMessage】：存储finalData和clickId成功', data, clickId)
      }
    });
  }
}
//暴露接口
module.exports.getUserNetwork = getUserNetwork