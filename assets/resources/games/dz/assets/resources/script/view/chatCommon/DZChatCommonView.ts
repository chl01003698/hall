/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示游戏中规则界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {DZChatCommonModel} from "./DZChatCommonModel";
import {HallConstant} from "../../../../../../../script/view/hall/HallConstant";
import {HallController} from "../../../../../../../script/view/hall/HallController";

 export class DZChatCommonView extends HallBaseView {
     private m_chatSp:any = null;
     private m_lookSp:any = null;
     private m_chatBtn:any = null;
     private m_lookBtn:any = null;
     private m_dzChatCommon:any;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            chatBtn:{varName:'m_chatBtn',callback:this.showChatInfo.bind(this)},
            lookBtn:{varName:'m_lookBtn',callback:this.showChatInfo.bind(this)},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/chatCommon/liaotian");
    }

    onPrefabLoaded(){
        this.m_dzChatCommon = this.getPrefabNode().getComponent('DZChatCommon');
        this.m_chatSp = this.m_chatBtn.getComponent(cc.Sprite);
        this.m_lookSp = this.m_lookBtn.getComponent(cc.Sprite);
        var event ={
            target:{name:'chatBtn'},
        }
        this.showChatInfo(event)
    }

     showChatInfo(event) {
         this.m_chatSp.enabled = false;
         this.m_lookSp.enabled = false;
         this.m_dzChatCommon.allListScrollView.node.active = false;
         this.m_dzChatCommon.lookScrollView.node.active = false;
         switch (event.target.name) {
             case 'chatBtn':
                 this.m_chatSp.enabled = true;
                 this.m_dzChatCommon.allListScrollView.node.active = true;
                 var chatCommonList = null;
                 if(HallUserModel.getInstance().getSex() == HallConstant.SexType.woman){
                     chatCommonList = DZChatCommonModel.getInstance().getWonmenChatCommon();
                 }else{
                     chatCommonList = DZChatCommonModel.getInstance().getMainChatCommon();
                 }
                 this.m_dzChatCommon.initChatCommonList(chatCommonList);
                 this.m_dzChatCommon.sendChatCommon = function (Commondate) {
                     h.viewManager.removeView(this);
                     // this.m_dzChatCommon.sendSysVoice(Commondate.index);
                     HallController.chat(this.chatCallBack.bind(this),0,Commondate.index);
                 }.bind(this);
                 break;
             case 'lookBtn':
                 this.m_lookSp.enabled = true;
                 this.m_dzChatCommon.lookScrollView.node.active = true;
                 var chatLookList = DZChatCommonModel.getInstance().getChatLook();
                 this.m_dzChatCommon.initChatLookList(chatLookList);
                 this.m_dzChatCommon.sendLookData = function (Lookdate) {
                     h.viewManager.removeView(this);
                     // this.m_dzChatCommon.sendExpression(Lookdate.index);
                     HallController.chat(this.chatCallBack.bind(this),1,Lookdate.index);
                 }.bind(this);
                 break;
         }
     }

     //常用语聊天回调
     chatCallBack(){

     }
     //表情会掉
     lookCallBack(){

     }

     closeCallback(){
        h.viewManager.removeView(this);
    }
 }
