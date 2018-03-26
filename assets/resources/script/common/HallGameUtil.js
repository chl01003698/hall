// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    statics:{
//随机
        random:function rnd(n, m){
            var random = Math.floor(Math.random()*(m-n+1)+n);
            return random;
        },
        /**
         * is 安卓
         */
        isAndroid: function () {
            if (cc.sys.isNative) {
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        /**
         * is iOS
         */
        isIOS: function () {
            if (cc.sys.isNative) {
                if (cc.sys.os == cc.sys.OS_IOS) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        //显示网络进度条
        showLoadding: function () {
            if (cc.qp.loadding.size() > 0) {
                let loaddingDialog = cc.qp.loadding.get();
                loaddingDialog.parent = cc.find("Canvas");

                // this._animCtrl = this.loaddingDialog.getComponent(cc.Animation);
                // var animState = this._animCtrl.play("loadding");
                // animState.wrapMode = cc.WrapMode.Loop;
            }
        },
        //验证手机号码 
        checkMobile: function (strMobile) {
            let reg = /^1\d{10}$/;
            if (reg.test(strMobile)) {
                return true;
            } else {
                return false;
            }
        }
    }
    // update (dt) {},
});
