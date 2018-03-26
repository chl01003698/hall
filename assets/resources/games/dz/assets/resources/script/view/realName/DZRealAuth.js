// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import {DZToast} from "../common/DZToast";
import {DZConstant} from "../../common/DZConstant";
import * as idCard from "./idCard";
import {HallConstant} from "../../../../../../../script/view/hall/HallConstant";
cc.Class({
    extends: cc.Component,

    properties: {
        nickName: cc.EditBox,
        id: cc.EditBox,

        boyHitNode: cc.Node,
        girlHitNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nickName.string = '';
        this.id.string = '';
        this.sex = HallConstant.SexType.man;
        this._updateSex();
    },

    start () {

    },

    onboyClick: function () {
        this.sex = HallConstant.SexType.man;
        this._updateSex();
    },

    onGirlClick: function () {
        this.sex = HallConstant.SexType.woman;
        this._updateSex();
    },

    _updateSex:function () {
        this.boyHitNode.active = !this.sex;
        this.girlHitNode.active = this.sex;
    },

    // update (dt) {},

    onComfirmClick: function () {
        if(this.id.string.length > 0 && this.nickName.string.length >1) {
            if(idCard.isLegal(this.id.string)) {
                this.comfire(this.nickName.string,this.sex,this.id.string);
            }else {
                DZToast.show('身份证号不合法');
            }
        }else {
            DZToast.show('输入不合法');
        }
    },
});
