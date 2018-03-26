/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 15:10:01 
 * @Desc: 发红包
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { DZToast } from "../common/DZToast";
import { DZRedPacketController } from "./DZRedPacketController";

export class DZRedPacketView extends HallBaseView {
    private cardNumLabel:cc.Node;
    private cardNumEB:cc.EditBox;
    private packetNumEB:cc.EditBox;
    private textEB:cc.EditBox;

    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            cardNum:{varName:"cardNumLabel"},
            cardNumEB:{varName:"cardNumEB"},
            packetNumEB:{varName:"packetNumEB"},
            textEB:{varName:"textEB"},
            ok:{callback:this.sendCallback.bind(this)},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/redPacket/fahongbao");
    }

    onPrefabLoaded(){
        this.cardNumLabel.getComponent(cc.Label).string = HallUserModel.getInstance().getCardCount();
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }

    sendCallback(){
       let deskCardNum:string = this.cardNumEB.getComponent(cc.EditBox).string;
       let packetNum:string = this.packetNumEB.getComponent(cc.EditBox).string;
       let text:string = this.textEB.getComponent(cc.EditBox).string;
       if(deskCardNum == ""){
           DZToast.show("请输入桌卡数量");
           return;
        }
        if(packetNum == ""){
            DZToast.show("请输入红包数量");
            return;
        }
        if(text = ""){
            text = this.textEB.getComponent(cc.EditBox).placeholder;
        }
        DZRedPacketController.sendRedPacket(null, parseInt(deskCardNum), parseInt(packetNum), text);
    }
}
