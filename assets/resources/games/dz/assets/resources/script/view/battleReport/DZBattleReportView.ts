/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示总战报界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {DZBattleReportModel} from "./DZBattleReportModel";
import {DZjiesuanModel} from "../../jiesuan/DZjiesuanModel";
import {DZGameUtil} from "../../common/DZGameUtil";
import {CreateModel} from "../../createTable/DZCreateModel";
import {HallController} from "../../../../../../../script/view/hall/HallController";
import {DZHallController} from "../hall/DZHallController";
import { DZGameController } from "../game/DZGameController";
import { DZGameModel } from "../game/DZGameModel";
import { DZSingleBattleReportController } from "../singleBattleReport/DZSingleBattleReportController";
import {DZPlaySound} from "../game/sound/DZPlaySound";

 export class DZBattleReportView extends HallBaseView {
     private m_zhanbao:any = null;
     private m_zhuohao:any = null;
     private m_jushu:any = null;
     private m_guize:any = null;
     private m_close:any = null;
     private m_fanhui:any = null;
     private m_zaikai:any = null;
    constructor(){
        super();
        // this.m_showAllBtn = showAllBtn;
        // DZBattleReportModel.getInstance().FN_SetShowAll(showAllBtn);
        this.setBindDatas({
            x:{varName:'m_close',callback:this.closeCallback.bind(this)},
            fenxiang:{callback:this.shareCallBack.bind(this)},
            fanhui:{varName:'m_fanhui',callback:this.backCallBack.bind(this)},
            zaikai:{varName:'m_zaikai',callback:this.reOpenCallBack.bind(this)},
            zhuohao:{varName:'m_zhuohao'},
            jushu:{varName:'m_jushu'},
            guize:{varName:'m_guize'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/battleReport/zhanbao_zong");
    }

    onPrefabLoaded(){
        if( DZBattleReportModel.getInstance().FN_GetShowAll()){
            this.m_close.active = false;
            this.m_fanhui.active = true;
            this.m_zaikai.active = true;
        }else{
            this.m_close.active = true;
            this.m_fanhui.active = false;
            this.m_zaikai.active = false;
        }
        this.m_zhanbao = this.getPrefabNode().getComponent('DZZhanbaozong');
        let m_guizeLabel = this.m_guize.getComponent(cc.Label);
        let m_jushuLabel = this.m_jushu.getComponent(cc.Label);
        let m_zhuohaoLabel = this.m_zhuohao.getComponent(cc.Label);
        m_guizeLabel.string = '规则：' + DZBattleReportModel.getInstance().FN_GetConfig();//cc.qp.ruleInfo;
        m_jushuLabel.string = '局数：'+DZBattleReportModel.getInstance().FN_GetCurRound() +'/' +DZBattleReportModel.getInstance().FN_GetRound();
        m_zhuohaoLabel.string = '桌号：'+DZBattleReportModel.getInstance().FN_GetRoomId();
        var gameList = DZBattleReportModel.getInstance().FN_GetGameInfoList();
        var playerList = DZBattleReportModel.getInstance().FN_GetPlayInfoList();
        if(gameList.length == 0|| playerList.length == 0 ){
            this.m_zhanbao.noData.active = true;
            return;
        }
        this.m_zhanbao.noData.active = false;
        this.m_zhanbao.initZhanBaoList(gameList);
        this.m_zhanbao.initNameList(playerList);
        this.m_zhanbao.initPlayerList(playerList);
        this.m_zhanbao.jumpReport = function (index) {
            // var reportData={};
            // reportData.target = self.data.target;
            // reportData.index = index;
            // self.sendNotification(Constants.battleReportState.battle_report_onload,reportData);
            let data = {
                index:index,
                data:DZBattleReportModel.getInstance().FN_GetTotalData()
            }
            DZSingleBattleReportController.showSingleBattleReportView(data);
        };

    }
    closeCallback(){
        h.viewManager.removeView(this);
    }

    shareCallBack(){
        h.commonSDK.screenshot(cc.director.getScene(), null, function(filepath, filename){
            h.commonSDK.shareImage(filepath);
        });
    }

    backCallBack(){
        //先移除游戏主界面
        h.viewManager.removeView(this);
        DZGameController.removeDZGameView();
        DZHallController.showDZHallView();
        DZPlaySound.getInstance().clearPlayer();
    }

    reOpenCallBack(){
        h.log.debug("$$$...再开一桌");
        h.viewManager.removeView(this);
        DZGameController.removeDZGameView();
        let param = {
            "config":{}
        }
        param.config = DZGameModel.getInstance().getRoomConfig();
        h.log.debug("$$$...roomConfig=" + param.config);
        HallController.create(null,param);
    }
 }
