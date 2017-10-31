//index.js
//获取应用实例
const app = getApp()
var AMAP = require('../../utils/amap-wx.js')
var amap = new AMAP.AMapWX({ key: "ef2e6b7c1651caa33819335face4c897" });

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    index:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasStartSuggest: false,
    hasEndSuggest: false,
    suggestPois: [],
    typeArray: ['步行', '骑行', '公交', '驾车'],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getSuggestTip: function (res, that, id) {
    amap.getInputtips({
      keywords: res,
      location: "",
      success: function (data) {
        switch (id) {
          case "startPlace":
            that.setData({
              hasStartSuggest: true
            })
            break
          case "endPlace":
            that.setData({
              hasEndSuggest: true
            })
            break
          default:
            break
        }
        that.setData({
          suggestPois: data.tips,
          suggestPlace: id,
        });
        console.log(that.data);
      }
    })
  },
  bindPickerChange:function(res){
    var index = res.detail.value
    this.setData({
      index:index
    })
    console.log(res)
  },
  suggestBindTap: function (res) {
    var that = this;
    console.log(res)
    var poisId = res.currentTarget.id
    var temp = that.data.suggestPois.filter(place => place.id == poisId)
    console.log(temp)
    if (that.data.hasStartSuggest) {
      that.setData({
        hasStartSuggest: false,
        startPlace: temp[0]
      })
    }
    if (that.data.hasEndSuggest) {
      that.setData({
        hasEndSuggest: false,
        endPlace: temp[0]
      })
    }
  },

  inputBind: function (res) {
    var that = this;
    console.log(res);
    var len = that.getStrLen(res.detail.value)
    console.log(len);
    if (len >= 4) {
      that.getSuggestTip(res.detail.value, that, res.currentTarget.id);
    }

  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getStrLen: function (str) {
    var strlen = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
        strlen += 2;
      else
        strlen++;
    }
    return strlen;
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
