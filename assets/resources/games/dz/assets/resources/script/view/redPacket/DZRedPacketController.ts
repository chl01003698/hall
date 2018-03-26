/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 15:06:59 
 * @Desc: 文件描述
 */

import { DZRedPacketView } from "./DZRedPacketView";
import { h } from "../../../../../../../script/common/H";
import { HallNetConfig } from "../../../../../../../script/net/HallNetConfig";
import { HallSDKConstant } from "../../../../../../../script/sdk/HallSDKConstant";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import { HallController } from "../../../../../../../script/view/hall/HallController";

 export class DZRedPacketController {

    static showRedPacketView(){
        let view = new DZRedPacketView();
        h.viewManager.pushView(view);
    }

    static sendRedPacket(callback:Function, cardNum:number, packetNum:number, text:string){
       HallController.shareWebpage(HallNetConfig.webpage.redEnvelope);
    }
 }