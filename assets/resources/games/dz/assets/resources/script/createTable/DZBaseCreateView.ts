/*
 * @Desc: 创建牌桌父类
 */

import { CreateController } from "./DZCreateController";
import { HallBaseView } from "../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../script/common/H";
import { CreateModel } from "./DZCreateModel";
import { HallController } from "../../../../../../script/view/hall/HallController";
import { DZGameController } from "../view/game/DZGameController";
import { DZToast } from "../view/common/DZToast";

var payTypes = cc.Enum({
    bigWinnerPay: 'winner',
    horseOwnerPay: 'owner',
});

var itemNum = 30;


export class BaseCreateView extends HallBaseView {
    type: any;
    createInfo: any;
    btnItemPool: cc.NodePool;
    userNode: any[];
    wanfaItemArray: any[];
    typeName: string = "";
    protected playTypeLayout: cc.Node;
    protected roomCard: cc.Label;
    protected settingName: cc.Label;
    protected changeBtn: cc.Node;
    protected beginBtn: cc.Node;
    protected houseOwnerPay: cc.Node;
    protected winnerPay: cc.Node;
    protected Title: cc.Label;
    protected CloseBtn: cc.Node;

    protected isCommonSetting: boolean;

    constructor(type) {
        super();
        this.setBindDatas({
            playTypeLayout: { varName: "playTypeLayout" },
            roomCard: { varName: "roomCard" },
            settingName: { varName: "settingName" },
            changeBtn: { varName: "changeBtn", callback: this.onClickMySetting.bind(this) },
            beginBtn: { varName: "beginBtn", callback: this.onClickBegin.bind(this) },
            CloseBtn: {
                varName: "CloseBtn", callback: function () {
                    h.viewManager.removeView(this);
                }.bind(this)
            },
        });
    }
    onPrefabLoaded() {
        this.isCommonSetting = true;

        this.wanfaItemArray = [];   //玩家itemArray
        this.userNode = [];         //已经用了的对象
        this._createPool();
        this._addWanfaItem();
    }


    /**
    * 把所有的条目隐藏掉
    * 并且把用过的对象放回去
    * 
    */
    _hidAllWanfaItemAndObject() {
        cc.log('_hidAllWanfaItemAndObject');
        for (let i = 0; i < this.wanfaItemArray.length; i++) {
            this.wanfaItemArray[i].node.active = false;
        }

        cc.log('_hidAllWanfaItemAndObject' + this.userNode.length);
        cc.log('_hidAllWanfaItemAndObject  111   ' + this.btnItemPool.size());
        for (let i = 0; i < this.userNode.length; i++) {
            this.btnItemPool.put(this.userNode[i]);
        }
        cc.log('_hidAllWanfaItemAndObject  222   ' + this.btnItemPool.size());
    }

    /**
    * 
    * 节点池
    */
    _createPool() {
        this.btnItemPool = new cc.NodePool();

        for (let i = 0; i < itemNum; i++) {
            var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/createTable/btnItem', cc.Prefab)
            var btnItem = cc.instantiate(prefab);
            this.btnItemPool.put(btnItem);
        }
    }

    /**
     * 
     * 添加玩法条，子类实现
     */
    _addWanfaItem() {

    }

    updateView() {
        this.createInfo = CreateModel.getInstance().getCreateInfoArray(this.type);
        cc.log('updateView  ' + JSON.stringify(this.createInfo));

        //刷新玩法界面
        this._updatePlayTypeView(this.createInfo.playType);
    }

    changeView(param: any) {
        var createInfo = param;
        this.createInfo = param;
        //this.roomCard.string = createInfo.roomCard;

        //刷新玩法界面
        this._updatePlayTypeView(this.createInfo.playType);
        this.isCommonSetting = false;
        this.onClickMySetting();
    }


    _updatePlayTypeView(playTypearray) {
        cc.log('_updatePlayTypeView' + JSON.stringify(playTypearray));
        //根据isCommon节段，看一下是普通设置还是个性设置
        var commSettingArrary = [];
        var mySettingArray = [];
        for (var j = 0; j < playTypearray.length; j++) {
            playTypearray[j].index = j;
            if (playTypearray[j].isCommon) {
                commSettingArrary.push(playTypearray[j]);
            } else {
                mySettingArray.push(playTypearray[j]);
            }
        }
        if (this.isCommonSetting) {
            this._updateWanfaItem(commSettingArrary);
        } else {
            this._updateWanfaItem(mySettingArray);
        }
    }

    _updateWanfaItem(array) {
        this._hidAllWanfaItemAndObject();
        let separatorArr = [Math.floor(array.length / 2) - 1, array.length - 1]
        if (array.length >= 8) {
            separatorArr.splice(1, 1);
        }
        for (var i = 0; i < array.length; i++) {
            this.wanfaItemArray[i].node.active = true;
            this.wanfaItemArray[i].updateView(array[i], this);
            let lineNode: cc.Node = this.wanfaItemArray[i].node.getChildByName('xianRoot');
            lineNode.active = -1 !== separatorArr.indexOf(i);
        }
    }


    onClickMySetting() {
        cc.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        this.isCommonSetting = !this.isCommonSetting;
        this._updatePlayTypeView((this.createInfo.playType));
        this.settingName.getComponent(cc.Label).string = this.isCommonSetting ? "个性设置" : "可选玩法";
    }

    onClickBegin() {
        let param = {
            "config": {
                defaultSelet: {}
            }
        }
        param.config = CreateModel.getInstance().getConfig();
        param.config.defaultSelet = CreateModel.getInstance().getDefaultSelect();
        cc.log('onClickBegin' + JSON.stringify(param));
        HallController.create(this.createScuess.bind(this), param);
    }

    createScuess(data) {
        cc.log('createScuess' + JSON.stringify(data));
        if (data.code == 200) {
            h.viewManager.removeView(this);

            //这块把配制存起来
            CreateModel.getInstance().setLocalInfo();
        }
    }

}