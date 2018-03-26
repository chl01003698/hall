import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import NNgameControler from "../game/NNgameControler";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { NNConstant } from "../../common/NNConstant";
import { NNcreateTableMode } from "./NNcreateTableMode";
var itemNum = 30;

export default class NNcreateTableView extends HallBaseView {
    personality: cc.Node;
    layout: cc.Node;
    createInfo: any;
    btnItemPool: cc.NodePool;
    userNode: any[];
    isCommonSetting: boolean;
    quiteButton: any;
    normalButton: any;
    quiteBtn: any;
    normalBtn: any;
    settingName:cc.Node;
   
    constructor() {
        super();
        this.setBindDatas({
            "back": { varName: "back", callback: this.closeCreateView.bind(this) },
            "begin": { varName: "begin", callback: this.clickBegin.bind(this) },
            "guize": { varName: "guize", callback: this.clickRule.bind(this) },
            "normalButton": { varName: "normalButton", callback: this.clickNormal.bind(this) },
            "quiteButton": { varName: "quiteButton", callback: this.clickQuite.bind(this) },
            "quiteBtn": { varName: "quiteBtn"},
            "normalBtn": { varName: "normalBtn"},
            "layout": { varName: "layout"},
            "settingName": { varName: "settingName"},
            "personality": { varName: "personality", callback: this.onClickMySetting.bind(this) },

        });
        this.setPrefab("res/prefab/create/createTable");
    }

    onPrefabLoaded() {
        this.isCommonSetting = true;  
        this.userNode = [];         //已经用了的对象
        this._createPool();
        this.selectType(true);

    }

    //关闭界面
    closeCreateView() {
        cc.log('closeCreateView');
        h.viewManager.removeView(this);
    }

    clickBegin() {
        let param = {
            "config":{
                defaultSelet:{}
            }
        }
        param.config = NNcreateTableMode.getInstance().getBeginConfig();
        cc.log('onClickBegin' +JSON.stringify(param));
        HallController.create(this.createScuess.bind(this),param);
    }

    createScuess(data) {
        cc.log('createScuess' + JSON.stringify(data));
        if(data.code == 200) {
            h.viewManager.removeView(this);
            //这块把配制存起来
            //CreateModel.getInstance().setLocalInfo();
        }
    }    

    clickRule() {
        cc.log('guize');
    }

    //普通玩法
    clickNormal() {
        this.selectType(true);
    }

    //闪电玩法
    clickQuite() {
        this.selectType(false);
    }

    selectType(isNormal) {
        this.normalBtn.active = isNormal;
        this.quiteBtn.active = !isNormal;
        this.normalButton.active = ! isNormal;
        this.quiteButton.active = isNormal;

        this.personality.active = isNormal;
        if(isNormal) {
            this.updateView(NNConstant.wanfaType.normal);
            NNcreateTableMode.getInstance().setConfigType(NNConstant.wanfaType.normal);
        }else{
            this.isCommonSetting = true;
            this.updateView(NNConstant.wanfaType.quite);
            NNcreateTableMode.getInstance().setConfigType(NNConstant.wanfaType.quite);
        }
    }

     /**
     * 
     * 节点池
     */
    _createPool() {
        this.btnItemPool = new cc.NodePool();
        
        for(let i=0;i<itemNum;i++) {
            var prefab = cc.loader.getRes('res/prefab/create/btnItem', cc.Prefab) 
            var btnItem = cc.instantiate(prefab);
            this.btnItemPool.put(btnItem);
        }
    }

    updateView(type) {
        this.createInfo = NNcreateTableMode.getInstance().getCreateInfoArray(type);
        cc.log('updateView  ' + JSON.stringify(this.createInfo));
        //刷新玩法界面
        this._updatePlayTypeView(this.createInfo.playType);
    }

    _updatePlayTypeView(playTypearray) {
        cc.log('_updatePlayTypeView' + JSON.stringify(playTypearray));
        //根据isCommon节段，看一下是普通设置还是个性设置
        var commSettingArrary = [];
        var mySettingArray = [];
        for(var j = 0; j < playTypearray.length; j++) {
            playTypearray[j].index = j;
            if(playTypearray[j].isCommon) {
                commSettingArrary.push(playTypearray[j]); 
            }else {
                mySettingArray.push(playTypearray[j]);
            }
        }
        if(this.isCommonSetting) {
            this._updateWanfaItem(commSettingArrary);
        }else {
            this._updateWanfaItem(mySettingArray);
        }   
    }

    _updateWanfaItem(array) {
        this._hidAllWanfaItemAndObject();
        for(var i=0;i<array.length;i++) {
            let prefab = null;
            if(array[i].selectItem.length > 3) {
                cc.log('res/prefab/create/createItemBig');
                prefab = cc.loader.getRes('res/prefab/create/createItemBig', cc.Prefab); 
            }else{
                cc.log('res/prefab/create/createItem');
                prefab = cc.loader.getRes('res/prefab/create/createItem', cc.Prefab); 
            }
            var node = cc.instantiate(prefab);
            var wanfaItem = node.getComponent('NNwanfaItem');
            this.layout.addChild(node);
            wanfaItem.updateView(array[i],this);
        }
    }

     /**
     * 把所有的条目隐藏掉
     * 并且把用过的对象放回去
     * 
     */
    _hidAllWanfaItemAndObject() {
        cc.log('_hidAllWanfaItemAndObject');
        this.layout.removeAllChildren();
        
        for(let i=0;i<this.userNode.length;i++) {
            this.userNode[i].y = 0;
            this.btnItemPool.put(this.userNode[i]);
        }
    }

    onClickMySetting() {
        this.isCommonSetting = !this.isCommonSetting;
        this._updatePlayTypeView((this.createInfo.playType));
        this.settingName.getComponent(cc.Label).string = this.isCommonSetting ? "个性设置" : "常用设置";
    }
}