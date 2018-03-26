/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 15:32:17 
 * @Desc: 战报
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import NNgameModel from "../game/NNgameModel";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { NNFightRecordModel } from "../fightRecord/NNFightRecordModel";
import { NNFightReportModel } from "./NNFightReportModel";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { HallTimeUtil } from "../../../../../../../script/common/HallTimeUtil";
import { NNSingleBattleReportController } from "../singleBattleReport/NNSingleBattleReportController";
import { NNSingleBattleReportModel } from "../singleBattleReport/NNSingleBattleReportModel";

 export class NNFightReportView extends HallBaseView {
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            playerList:{varName:"playerList"},
            totalList:{varName:"totalList"},
            scoreList:{varName:"scoreList"},
            button_b2:{callback:this.shareCallback.bind(this)},
            tableIdLabel:{varName:"tableIdLabel"},
            timeLabel:{varName:"timeLabel"},
            timesLabel:{varName:"timesLabel"},
        });
        this.setPrefab("res/prefab/fightReport/fight_report");
    }

    onPrefabLoaded(){
        this.loadPlayerList();
        this.loadTotalList();
        this.loadScoreList();
        this.refreshInfo();
    }

    refreshInfo(){
        this.tableIdLabel.getComponent(cc.Label).string = HallStringUtil.format("桌号: {0}", NNFightReportModel.getInstance().getTableId());
        let timeStr = HallTimeUtil.getDateByFormat(NNFightReportModel.getInstance().getTime(), "yyyy/MM/dd hh:mm:ss");
        this.timeLabel.getComponent(cc.Label).string = HallStringUtil.format("对局时间: {0}", timeStr)
        this.timesLabel.getComponent(cc.Label).string = NNFightReportModel.getInstance().getCurrentRound();
    }

    loadScoreList(){
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/fight_report_node');
        let cell = cc.instantiate(cellPrefab) ;
        let cellSize = cell.getContentSize() ;
        let roundDatas = NNFightReportModel.getInstance().getRoundDatas();
        let cellBindDatas = {
            times:{varName:"timesLabel"},
            detailBtn:{varName:"detailBtn", callback:this.detailCallback.bind(this)},
            scrollview:{varName:"scoreList"},
        };
        let playerDatas = NNFightReportModel.getInstance().getPlayers();
        let handler = function(funcName, list, index){
            switch(funcName){
                case "count":
                    return roundDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    cell.timesLabel.getComponent(cc.Label).string = HallStringUtil.format("第{0}局", index + 1);
                    cell.detailBtn.tag = index;
                    this.loadRoundScroreList(cell.scoreList, index);
                    return cell;
            }
        };
        this.scoreList.getComponent("MyList").setHandler(handler.bind(this));
        this.scoreList.getComponent("MyList").reloadData();
    }

    loadRoundScroreList(scoreList, roundIndex){
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/score_node');
        let cell = cc.instantiate(cellPrefab) ;
        let cellSize = cell.getContentSize() ;
        let roundDatas = NNFightReportModel.getInstance().getRoundDatas();
        let playerDatas = NNFightReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            label:{varName:"scoreLabel"}
        };
        let handler = function(funcName, list, index){
            switch(funcName){
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let roundPlayerData = NNFightReportModel.getInstance().getRoundsPlayer(roundIndex, playerData.user._id);
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    if(roundPlayerData){
                        cell.scoreLabel.getComponent(cc.Label).string = String(roundPlayerData.win);
                    }else{
                        cell.scoreLabel.getComponent(cc.Label).string = "--";
                    }
                    return cell;
            }
        };
        scoreList.getComponent("MyList").setHandler(handler.bind(this));
        scoreList.getComponent("MyList").reloadData();
        scoreList.getComponent(cc.ScrollView).enabled = false;
    }

    loadTotalList(){
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/score_node');
        let cell = cc.instantiate(cellPrefab) ;
        let cellSize = cell.getContentSize() ;
        let playerDatas = NNFightReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            label:{varName:"scoreLabel"}
        };
        let handler = function(funcName, list, index){
            switch(funcName){
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    cell.scoreLabel.getComponent(cc.Label).string = String(playerData.score);
                    return cell;
            }
        };
        this.totalList.getComponent("MyList").setHandler(handler.bind(this));
        this.totalList.getComponent("MyList").reloadData();
        this.totalList.getComponent(cc.ScrollView).enabled = false;
    }

    loadPlayerList(){
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/fight_report_player');
        let cell = cc.instantiate(cellPrefab) ;
        let cellSize = cell.getContentSize() ;
        let playerDatas = NNFightReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            label:{varName:"nameLabel"},
            dayingjia:{varName:"bigWin"},
            yingbiao:{varName:"resultTag"},
            head:{varName:"head"},
        };
        let handler = function(funcName, list, index){
            switch(funcName){
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    cell.nameLabel.getComponent(cc.Label).string = playerData.user.nickname;
                    HallUIUtil.urlSprite(playerData.user.headimgurl, cell.head);
                    return cell;
            }
        };
        this.playerList.getComponent("MyList").setHandler(handler.bind(this));
        this.playerList.getComponent("MyList").reloadData();
        this.playerList.getComponent(cc.ScrollView).enabled = false;
    }


    detailCallback(event){
        let roundDatas = NNFightReportModel.getInstance().getRoundDatas();
        NNSingleBattleReportModel.getInstance().setRound(event.target.tag);
        NNSingleBattleReportController.showSingleBattleReportView(roundDatas[event.target.tag]);
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }

    shareCallback(){
        h.commonSDK.screenshot(cc.director.getScene(), null, function(filepath, filename){
            h.commonSDK.shareImage(filepath);
        });
    }
 }
