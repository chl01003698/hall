/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-26 11:33:19 
 * @Desc: 公用牌桌
 */

import { HallBaseView } from './../../common/HallBaseView';
import { h } from '../../common/H';
import { HallController } from './../hall/HallController';
import { HallUtil } from '../../util/HallUtil';
import { HallModel } from './../hall/HallModel';
import { HallTimeUtil } from './../../common/HallTimeUtil';
import { HallConstant } from '../hall/HallConstant';

 export class HallGameView extends HallBaseView {
    private voiceBtn:cc.Node;
    private timeLabel:cc.Node;

    constructor(){
        super();
        this.setBindDatas({
            time_tip:{varName:"timeLabel"},
            wifi:{varName:"wifiNode"},
            dianliang:{varName:" batteryNode"},
            yuyin:{varName:"voiceBtn"},
            liaotian:{callback:this.chatCallback.bind(this)}
        });
    }

    onPrefabLoaded(){
        h.voiceManager.bindButton(this.voiceBtn);
        this.loadDeviceInfo();
        h.eventManager.addListener(HallConstant.Event.uploadedVoice, this.onUploadedVoice, this);
    }

    refreshDeviceInfo(){
        this.refreshWifi();
        this.refreshBattery();
        this.refreshTime();
    }

    refreshWifi(){

    }

    refreshBattery(){

    }

    refreshTime(){
        this.timeLabel.getComponent(cc.Label).string = HallTimeUtil.getDateByFormat(new Date().getTime(), "hh:mm");
    }

    loadDeviceInfo(){
        this.refreshDeviceInfo();
        HallUtil.schedule(function () {
            this.refreshDeviceInfo();
        }.bind(this), this, 10, true);
    }

    chatCallback(){

    }

    // 语音上传成功
    onUploadedVoice(data) {
        let param = {
            type: HallConstant.ChatType.voice,
            fileID: data.fileID,
        }
        HallController.chatText(null, JSON.stringify(param));
    }
 }