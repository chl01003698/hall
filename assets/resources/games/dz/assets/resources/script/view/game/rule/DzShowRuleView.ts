import { HallBaseView } from "../../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../../script/common/H";
import SelectBtn from "./SelectBtn";
import BtnGroup from "./BtnGroup";
import { CreateModel } from "../../../createTable/DZCreateModel";
import { DZGameModel } from "../DZGameModel";
import { DZGameRuleController } from "../../gameRule/DZGameRuleController";
import { HallViewConfig } from "../../../../../../../../script/config/HallViewConfig";

let _ = require('lodash') ;

let testData =  {
    "payway": [
      0
    ],
    "expendIndex": [
      0
    ],
    "baseScore": [],
    "sendCards": [
      0
    ],
    "cardLandlord": [
      0
    ],
    "grabLandlord": [
      0
    ],
    "play": [
      0
    ],
    "showCard": [
      0
    ],
    "JiPaiQi": [
      0
    ],
    "remaining": [
      0
    ],
    "graspBottom": [
      0
    ],
    "article3": [],
    "plane": [],
    "four": []
  }

/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-17 13:47:10 
 * @Desc: 大厅界面
 */

export class DzShowRuleView extends HallBaseView {

    isCommon: boolean = true ;

    //打牌控制器
    layout: cc.Node = null;
    closeBtn: cc.Node = null ;
    settingBtn: cc.Node = null ;
    ruleBtn: cc.Node = null ;
    rootNode: cc.Node = null ;
    back: cc.Node = null ;
    constructor() {
        super();
        this.setBindDatas({
            "layout": { varName: "layout" }, // layout
            "close": { varName: "closeBtn", callback: this.onClose.bind(this)}, // 关闭按钮
            "setting": { varName: "settingBtn", callback: this.onSetting.bind(this)}, // 个性设置按钮
            "playrule": { varName: "ruleBtn", callback: this.onPlayrule.bind(this)}, // 规则按钮
            "background": { varName: 'back'}, // 背景
        });
        this.setPrefab("res/prefab/showrule/showrule");
    }

    //加载view完成
    onPrefabLoaded() {
        // this.testAdd() ;
        // this.testAdd1() ;
        let backSize = this.back.getContentSize() ;
        let screenSize = HallViewConfig.getUISize() ;
        let scale = HallViewConfig.getUIScale() ;
        let x = (screenSize.width / 2) + (backSize.width / 2) *　scale;
        let moveX = (screenSize.width / 2 ) - (backSize.width / 2) * scale;
        this.prefabNode.setPositionX(x) ;
        this.prefabNode.runAction(cc.moveTo(0.5, moveX, 0).easing(cc.easeInOut(2.0))) ;
        this._showRule(this.isCommon) ;
    }

    testAdd(){
        let btnGroupPrefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/btngroup");
        let btnPrefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/radiobtn");
        let checkBtnPrefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/checkbox");
        let btngroup: BtnGroup = cc.instantiate(btnGroupPrefab).getComponent('BtnGroup') ;
        let btngroup1: BtnGroup = cc.instantiate(btnGroupPrefab).getComponent('BtnGroup') ;
        let btn: SelectBtn  = cc.instantiate(btnPrefab).getComponent('SelectBtn') ;
        let btn1: SelectBtn  = cc.instantiate(btnPrefab).getComponent('SelectBtn') ;
        let btn3: SelectBtn  = cc.instantiate(btnPrefab).getComponent('SelectBtn') ;
        let btn4: SelectBtn  = cc.instantiate(btnPrefab).getComponent('SelectBtn') ;
        let btn5: SelectBtn  = cc.instantiate(checkBtnPrefab).getComponent('SelectBtn') ;
        let btn6: SelectBtn  = cc.instantiate(checkBtnPrefab).getComponent('SelectBtn') ;
        btn1.setSelectState(true) ;
        btn1.setName("ono") ;
        btn1.setType('radio') ;

        btn.setSelectState(false) ;
        btn.setName("哈哈") ;
        btn.setType('radio') ;

        btn5.setSelectState(false) ;
        btn5.setName('复选哦1') ;
        btngroup.addBtn(btn1) ;
        btngroup.addBtn(btn) ;
        btngroup.addBtn(btn5) ;
        btngroup.setName("分组2：") ;
        this.layout.addChild(btngroup.node) ;

        btn3.setSelectState(true) ;
        btn3.setName("ono") ;
        btn3.setType('radio') ;

        btn4.setSelectState(false) ;
        btn4.setName("呀呀") ;
        btn4.setType('radio') ;

        btn6.setSelectState(false) ;
        btn6.setName('复选哦2') ;
        btngroup1.addBtn(btn3) ;
        btngroup1.addBtn(btn4) ;
        btngroup1.addBtn(btn6) ;
        btngroup1.setName("分组1：") ;
        this.layout.addChild(btngroup1.node) ;
    }

    testAdd1(){
        let btnGroup: BtnGroup = this.createBtnGroup('啦啦啦：') ;
        btnGroup.addBtn(this.createRadioBtn('单选一', true)) ;
        btnGroup.addBtn(this.createRadioBtn('单选二', false)) ;
        btnGroup.addBtn(this.createCheckBoxBtn('复选哦', false)) ;
        this.addBtnGroup(btnGroup) ;

        let btnGroup1: BtnGroup = this.createBtnGroup('就是这么吊：') ;
        btnGroup1.addBtn(this.createRadioBtn('单选一', false)) ;
        btnGroup1.addBtn(this.createRadioBtn('单选二', true)) ;
        btnGroup1.addBtn(this.createCheckBoxBtn('复选哈哈', true)) ;
        this.addBtnGroup(btnGroup1) ;
    }

    _showRule(common: boolean){
        this.layout.removeAllChildren() ;
        let roomConfig = DZGameModel.getInstance().getRoomConfig()
        let creatData =  CreateModel.getInstance().getCreateData(roomConfig.type)[0] ;
        let configData = roomConfig.defaultSelet ;
        let isCommon = common ;
        let filterCommon = creatData.playType.filter((v) => isCommon == v.isCommon) ;
        let separatorArr = [Math.floor(filterCommon.length / 2) - 1, filterCommon.length - 1]
        if(filterCommon.length >= 8 ){
            separatorArr.splice(1, 1) ;
        }
        filterCommon.forEach((v, vi) => {

            // add 按钮组
            let btnGroup = this.createBtnGroup(v.playTypeName) ;
            let creatBtnFunc = 'Radio' == v.selectType ? this.createRadioBtn.bind(this) : this.createCheckBoxBtn.bind(this) ;
            v.selectItem.forEach((s, si) => {
                creatBtnFunc = ("闷抓" === s.des) ? this.createCheckBoxBtn.bind(this) : creatBtnFunc ; 
                btnGroup.addBtn(creatBtnFunc(s.des, -1 !== configData[v.name].indexOf(si))) ;
            });
            this.addBtnGroup(btnGroup) ;

            // add分隔符
            if(-1 !== separatorArr.indexOf(vi)){
                this.addSeparatorGroup() ;
            }
        });

        var title    = cc.find( "uiNode/rootLayer/title", this.prefabNode );
        title.getComponent(cc.Label).string = creatData.name;

        console.log('omggg' , JSON.stringify(creatData[0])) ;
    }

    addBtnGroup(btnGroup){
        this.layout.addChild(btnGroup.node) ;
    }

    addSeparatorGroup(){
        let prefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/separator");
        let separator = cc.instantiate(prefab) ;
        this.layout.addChild(separator) ;
    }

    createBtnGroup(name:string){
        let btnGroupPrefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/btngroup");
        let btnGroup = cc.instantiate(btnGroupPrefab).getComponent('BtnGroup') ;
        btnGroup.setName(name) ;
        return btnGroup ;
    }

    createRadioBtn(name:string, selectState: boolean){
        let btnPrefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/radiobtn");
        let btn: SelectBtn  = cc.instantiate(btnPrefab).getComponent('SelectBtn') ;
        btn.setName(name) ;
        btn.setType('radio') ;
        btn.setSelectState(selectState) ;
        return btn ;
    }

    createCheckBoxBtn(name:string, selectState: boolean){
        let btnPrefab: cc.Prefab = h.resManager.getPrefabByName("res/prefab/showrule/checkbox");
        let btn: SelectBtn  = cc.instantiate(btnPrefab).getComponent('SelectBtn') ;
        btn.setName(name) ;
        btn.setSelectState(selectState) ;
        return btn ;
    }

    onClose(){
        let backSize = this.back.getContentSize() ;
        let screenSize = HallViewConfig.getUISize() ;
        let scale = HallViewConfig.getUIScale() ;
        let moveX = (screenSize.width / 2) + (backSize.width / 2) * scale;
        this.prefabNode.runAction(cc.sequence(
            cc.moveTo(0.7, moveX, 0).easing(cc.easeIn(2.0)), 
            cc.callFunc(function(){
                h.viewManager.removeView(this);
            }.bind(this)),
        )) ;

        h.log.debug('cccc') ;
    }

    onSetting(){
        this.isCommon = !this.isCommon ;
        this._showRule(this.isCommon) ;
    }

    onPlayrule(){
        DZGameRuleController.showGameRuleView(DZGameModel.getInstance().getRoomConfig().type);
    }
}