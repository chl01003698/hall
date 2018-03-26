/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示京东卡界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {DZInvitedFriendController} from "../invitedFriend/DZInvitedFriendController";
import {DZJingDongModel} from "./DZJingDongModel";
import {DZJingDongController} from "./DZJingDongController";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallAlert} from "../../../../../../../script/common/HallAlert";
import {DZGameRuleController} from "../gameRule/DZGameRuleController";
import {HallController} from "../../../../../../../script/view/hall/HallController";
import {HallNetConfig} from "../../../../../../../script/net/HallNetConfig";
import {HallToast} from "../../../../../../../script/common/HallToast";
enum BtnType {
    one = 1,
    two,
    three,
}
 export class DZJingDongView extends HallBaseView {
     private m_inviteNumMap = new Map();
     private m_yugu:cc.Node;
     private m_invite:cc.Node;
     private m_invited:cc.Node;
     private m_expect:cc.Node;
     private m_reward1:cc.Node;
     private m_reward2:cc.Node;
     private m_reward3:cc.Node;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            rewardOneBtn:{callback:this.rewardBtnCallback.bind(this)},
            rewardTwoBtn:{callback:this.rewardBtnCallback.bind(this)},
            rewardThreeBtn:{callback:this.rewardBtnCallback.bind(this)},
            yiyaohaoyou:{varName:'m_invited',callback:this.invitedFriendCallBack.bind(this)},
            yugu:{varName:'m_yugu'},
            inviteBtn:{varName:'m_invite',callback:this.inviteBtn.bind(this)},
            jingqingqidai:{varName:'m_expect'},
            reward1:{varName:'m_reward1'},
            reward2:{varName:'m_reward2'},
            reward3:{varName:'m_reward3'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/jingDong/fenxianghaoyousongjingdongka");
    }

    onPrefabLoaded(){
        if(this.m_inviteNumMap.size <= 0){
            for(let i = 1; i <= 10;i++){
                let node = cc.find('uiNode/di/yugu/ding/' + i,this.getPrefabNode());
                this.m_inviteNumMap.set(i,node);
            }
        }
        this.udateReward();
        this.updateInvite();
    }

    //更新领取状态
     udateReward(){
         this.m_reward1.active = false;
         this.m_reward2.active = false;;
         this.m_reward3.active = false;;
        for(let i = 0; i <DZJingDongModel.getInstance().FN_GetReward().length;i++ ){
            var reward = DZJingDongModel.getInstance().FN_GetReward()[i];
            switch (reward){
                case 1:
                    this.m_reward1.active = true;
                    break;
                case 2:
                    this.m_reward2.active = true;
                    break;
                case 3:
                    this.m_reward3.active = true;
                    break;
            }
        }
     }


     updateInvite() {
         this.m_inviteNumMap.forEach(function (value,key) {
             if(DZJingDongModel.getInstance().FN_GetInviteNum() >= key){
                 this.m_inviteNumMap.get(key).active = true;
             }else{
                 this.m_inviteNumMap.get(key).active = false;
             }
         }.bind(this));
         // this.showQiDai();
     }

     // showQiDai() {
     //     if(DZJingDongModel.getInstance().FN_GetInviteNum() == 10 && DZJingDongModel.getInstance().FN_GetRewardThree()){
     //         this.m_expect.active = true;
     //         this.m_invited.active = false;
     //         this.m_invite.active = false;
     //         this.m_yugu.active = false;
     //     }else{
     //         this.m_expect.active = false;
     //         this.m_invited.active = true;
     //         this.m_invite.active = true;
     //         this.m_yugu.active = true;
     //     }
     // }

    invitedFriendCallBack(){
        DZInvitedFriendController.showInvitedFriendView();
    }

    inviteBtn(){
        HallController.inviteGiftCard();
    }

    closeCallback(){
         h.viewManager.removeView(this);
     }
     rewardBtnCallback(event){
         var rewardStr = 0;
         let people = 0;
        switch (event.target.name){
            case 'rewardOneBtn':
                rewardStr = 1;
                people = 1;
                break;
            case 'rewardTwoBtn':
                rewardStr = 2;
                people = 5;
                break;
            case 'rewardThreeBtn':
                rewardStr = 3;
                people = 10;
                break;
        }
         // var info ={
         //     id:HallUserModel.getInstance().getUserID(),//'5a6556193b7e1fa75ca20dd7',
         //     index:rewardStr,
         // }
         // DZJingDongController.requsetReward(this.rewardCallBack.bind(this),info);

        if(DZJingDongModel.getInstance().FN_GetInviteNum() >= people){
            if(this.checkIsRecive(rewardStr)){
                HallToast.show('已领取');
            }else{
                var info ={
                    id:HallUserModel.getInstance().getUserID(),//'5a6556193b7e1fa75ca20dd7',
                    index:rewardStr,
                }
                DZJingDongController.requsetReward(this.rewardCallBack.bind(this),info);
            }
        }else{
            HallToast.show('不满足条件');
        }
     }

     checkIsRecive(rewardIndex): any {
         for (let i = 0; i < DZJingDongModel.getInstance().FN_GetReward().length; i++) {
             if (rewardIndex == DZJingDongModel.getInstance().FN_GetReward()[i]) {
                 return true;
             }
         }
         return false;
     }

     //领取奖励回调
     rewardCallBack(data) {
         if (data.code == 0) {
             DZJingDongModel.getInstance().FN_AddReward(data.data.index);
             this.udateReward();
             HallUserModel.getInstance().addCardCount(data.data.card);
             HallAlert.show("领取成功");
         }else{
             HallAlert.show(data.msg);
         }

     }
 }
