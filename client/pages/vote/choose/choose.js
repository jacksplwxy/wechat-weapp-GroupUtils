var app = getApp()
var p = new Promise(function (resolve, reject) {  //创建promise，确保页面加载数据前已经加载了openid!
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.request({
          url: app.globalData.host + '/application/link/getOpenid.php',
          data: {
            appid: app.globalData.AppID,
            secret: app.globalData.secret,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          dataType: 'JSONP',
          success: function (res) {  //服务端请求并存储openid,并发送openid过来
            var data0 = JSON.parse(res.data);
            app.globalData.openid = data0.openid;
            app.globalData.session_key = data0.session_key;
            resolve();
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
})

Page({
  data: {
    voteid: '',
    taskData: '',
    optionData: '',
    uniqueClickState: '',//定义选择被选中的状态
    okWord: '确 认 投 票',//当前用户是否投票
    shareHidden: true, //分享面板隐藏
  },
  onLoad: function (opt) {
    app.globalData.fromClickId= opt.fromClickId
    wx.showShareMenu({
      withShareTicket: true
    })

    var that = this;
    that.setData({
      voteid: opt.voteid,
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({  //第一次请求投票任务的详情数据
      url: app.globalData.host + '/application/vote/getVoteTask.php',
      data: {
        voteid: opt.voteid,
      },
      dataType: 'JSONP',
      success: function (res) {
        var data0 = JSON.parse(res.data)[0]
        var optionData0 = JSON.parse(data0.optionData);
        var uniqueClickState = {};
        for (let i = 0; i < optionData0.length; i++) {
          let value = optionData0[i].unique
          uniqueClickState[value] = false;
        }
        that.setData({
          taskData: data0,
          optionData: JSON.parse(data0.optionData),
          uniqueClickState: uniqueClickState,
        })

        p.then(function () {
          /************判断用户是否已投票可以遍历投票中是否含该用户的openid**********/
          var joinerData = that.data.optionData;
          for (var i = 0; i < joinerData.length; i++) {
            for (var j = 0; j < joinerData[i].joiner.length; j++) {
              if (joinerData[i].joiner[j][0] == app.globalData.openid) {
                console.log('该用户已投票');
                that.setData({
                  okWord: '已投票',
                })
                return false;
              }
            }
          }
        })
        wx.hideLoading();
      }
    });
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      path: '/pages/vote/choose/choose?voteid=' + that.data.voteid + '&fromClickId=' + app.globalData.clickId,
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
              //url: 'https://test.hytips.com/wechat/Gold/demo.php',
              url: app.globalData.host + '/application/link/wx_xcx.php',
              data: {
                appid: app.globalData.AppID,  //小程序ID
                sessionKey: app.globalData.session_key,
                encryptedData: encryptedData,
                iv: iv
              },
              dataType: 'JSONP',
              success: function (res) {
                //此处有坑:返回的数据不是JSON字符串!
                var GId = JSON.parse(res.data.substring(res.data.indexOf('{'), res.data.lastIndexOf('}') + 1)).openGId;
                console.log('转发时获取的GID为:' + GId)
                wx.request({
                  url: app.globalData.host + '/application/vote/storeVoteGId.php',
                  data: {
                    gid: GId,
                    voteid: that.data.voteid,
                  },
                  dataType: 'JSONP',
                  success: function (res) {
                    console.log(res.data)
                  }
                });
              }
            });
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  voteOne: function (e) { //配置单选/多选的选择状态
    var that = this;
    if (that.data.okWord != '已投票' && that.data.taskData.radio == 0) { //未投票，且是单选
      /*//此处问题：为什么不能用that.data.optionData？
      var optionData0 = JSON.parse(that.data.taskData.optionData);
      for (var j = 0; j < optionData0.length; j++) {//判断当前是第几个选项
        if (optionData0[j].unique == e.currentTarget.dataset.unique) {
          that.setData({  //给当前选项打钩
            currentUnique: e.currentTarget.dataset.unique,
          })
          break;
        }
      }*/
      var optionData0 = JSON.parse(that.data.taskData.optionData);  //每次重新获取uniqueClickState的状态
      var uniqueClickState = {};
      for (let i = 0; i < optionData0.length; i++) {
        let value = optionData0[i].unique
        uniqueClickState[value] = false;
      }
      uniqueClickState[e.currentTarget.dataset.unique] = !uniqueClickState[e.currentTarget.dataset.unique];
      that.setData({  //保存当前状态
        uniqueClickState: uniqueClickState,
      })
    } else if (that.data.okWord != '已投票' && that.data.taskData.radio == 1) {
      var uniqueClickState = that.data.uniqueClickState
      uniqueClickState[e.currentTarget.dataset.unique] = !uniqueClickState[e.currentTarget.dataset.unique];
      that.setData({  //保存当前状态
        uniqueClickState: uniqueClickState,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已投过票啦！',
      })
    }
  },
  ok: function () {
    var that = this;
    var hasSelected = false;  //初始状态用户未选择选项
    for (var i = 0; i < that.data.optionData.length; i++) {
      if (that.data.uniqueClickState[that.data.optionData[i].unique]) { //若选项中存在true，则说明用户选了选项
        hasSelected = true;
        break;
      }
    }
    if (!hasSelected) { //判断当前用户是否选择了选项
      wx.showModal({
        title: '提示',
        content: '请勾选您的选项！',
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({  //再次请求投票任务的详情数据，防止其他用户更新了数据库
        url: app.globalData.host + '/application/vote/getVoteTask.php',
        data: {
          voteid: that.data.voteid,
        },
        dataType: 'JSONP',
        success: function (res) {
          /****************获取最新的数据库数据，并将点击选项后的数据在本地更新******************/
          var data0 = JSON.parse(res.data)[0]
          var optionData0 = JSON.parse(data0.optionData);

          var totalNumber = 0;
          for (var i = 0; i < optionData0.length; i++) { //计算总投票数
            totalNumber = totalNumber + optionData0[i].number;
          }
          for (var j = 0; j < optionData0.length; j++) {
            if (that.data.uniqueClickState[optionData0[j].unique]) {
              optionData0[j].number = optionData0[j].number + 1;
              totalNumber = totalNumber + 1;
              optionData0[j].joiner.push([app.globalData.openid, app.globalData.userInfo.avatarUrl]);// 在当前选项中压入openid和图片
            }
          }
          for (var k = 0; k < optionData0.length; k++) { //所有数据加完以后再次计算投票百分比
            optionData0[k].percent = parseInt((optionData0[k].number / totalNumber) * 100)
          }
          /************将本地的数据提交到数据库**********/
          that.submit(optionData0);
        }
      });
    }
  },
  submit: function (joinerData) {   //提交用户投票数据
    var that = this;
    wx.request({  //将投票后的optionData0更新保存到数据库，并且单独保存openid为user表示该用户已投票
      url: app.globalData.host + '/application/vote/storeVoteOne.php',
      data: {
        voteid: that.data.voteid,
        optionData: joinerData,
        openid: app.globalData.openid
      },
      dataType: 'JSONP',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          optionData: joinerData,
        })
        that.setData({
          okWord: '已投票',
        });
        wx.showToast({
          title: '投票成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  showShare: function () {
    var that = this;
    that.setData({
      shareHidden: !that.data.shareHidden
    })
  },
  /*获取二维码正常流程：后台获取图片流储存返回图片地址给前台 */
  getQRCode: function () {
    var that = this;
    wx.request({
      //url: app.globalData.host + '/application/vote/getQRCode.php',
      url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode',
      data: {
        session_key: app.globalData.session_key,
        path: "pages/vote/choose/choose?voteid=" + that.data.voteid,
        width: 430
      },
      dataType: 'JSONP',
      success: function (res) {
        console.log('获取成功', res)
      }
    })
  }
})

