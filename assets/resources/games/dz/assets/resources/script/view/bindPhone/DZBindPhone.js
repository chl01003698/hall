// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import {HallAlert} from "../../../../../../../script/common/HallAlert";
import {BindPhoneModel} from "./BindPhoneModel";
var validator = require('validator.min');
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        phoneNumber: cc.EditBox,
        verifyNumber: cc.EditBox,
        curTime:0,
        sendSucess : false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.phoneNumber.string = '';
        this.verifyNumber.string = '';
        self.time = 60;
    },

    start() {

    },

     update (dt) {
         if (this.sendSucess) {
             this.curTime += dt;
             if (this.curTime >= 1) {
                 this.curTime = 0;
                 self.time -= 1;
                 this.sendTime(self.time);
                 if (self.time <= 0) {
                     this.sendSucess = false;
                     self.time = 60;
                 }
             }
         }
     },
    ok: function(){

    },
    onGetverify: function () {
        cc.log('this.phoneNumber.string.length' + this.phoneNumber.string.length);
        if (!validator.isMobilePhone(this.phoneNumber.string,'zh-CN')) {
            HallAlert.show('请输入正确的手机号',this.ok);
            // let btnString = ['确定'];
            // let callBack = [this.ok];
            // cc.qp.alert.show('提示','请输入正确的手机号',btnString,callBack);
        }else {
            cc.log('发送验证码');
            if(!this.sendSucess){
                this.sendSucess = true;
                this.sendPhoneNumber(this.phoneNumber.string);
                this.sendTime(self.time);
            }
        }
    },

    onBindPhone: function () {

        var reg = /^\d{4}\b/;

        if (reg.test(this.verifyNumber.string)) {
            if (this.verifyNumber.string.length == 4 && BindPhoneModel.getInstance().getSmsVerCode() == this.verifyNumber.string) {
                this.bindPhone(this.phoneNumber.string, this.verifyNumber.string);
            }else{
                this.alertTips('输入有误');
            }
        }else{
            this.alertTips('请输入正确的验证码格式');
        }
    },

    alertTips:function (info) {
        // let btnString = ['确定'];
        // let callBack = [this.ok];
        // cc.qp.alert.show('提示',info,btnString,callBack);
        HallAlert.show(info,this.ok);
    },

    onClose: function () {
        this.closeSelf();
        this.saveData(self.time,this.sendSucess,this.phoneNumber.string);
    }
});
