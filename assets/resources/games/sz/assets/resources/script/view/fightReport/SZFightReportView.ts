import { SZHallController } from './../hall/SZHallController';
/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 15:32:17 
 * @Desc: 战报
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import SZgameModel from "../game/SZgameModel";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { SZFightRecordModel } from "../fightRecord/SZFightRecordModel";
import { SZFightReportModel } from "./SZFightReportModel";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { HallTimeUtil } from "../../../../../../../script/common/HallTimeUtil";
import { SZSingleBattleReportController } from "../singleBattleReport/SZSingleBattleReportController";
import { SZSingleBattleReportModel } from "../singleBattleReport/SZSingleBattleReportModel";
import { SZConstant } from '../../common/SZConstant';

export class SZFightReportView extends HallBaseView {
    type: any;
    constructor(type) {
        super();
        this.type = type;
        this.setBindDatas({
            x: { callback: this.closeCallback.bind(this) },
            playerList: { varName: "playerList" },
            totalList: { varName: "totalList" },
            scoreList: { varName: "scoreList" },
            button_b2: { callback: this.shareCallback.bind(this) },
            tableIdLabel: { varName: "tableIdLabel" },
            timeLabel: { varName: "timeLabel" },
            timesLabel: { varName: "timesLabel" },
        });
        this.setPrefab("res/prefab/fightReport/fight_report");
    }

    onPrefabLoaded() {
        this.loadPlayerList();
        this.loadTotalList();
        this.loadScoreList();
        this.refreshInfo();
    }

    refreshInfo() {
        this.tableIdLabel.getComponent(cc.Label).string = HallStringUtil.format("桌号: {0}", SZFightReportModel.getInstance().getTableId());
        let timeStr = HallTimeUtil.getDateByFormat(SZFightReportModel.getInstance().getTime(), "yyyy/MM/dd hh:mm:ss");
        this.timeLabel.getComponent(cc.Label).string = HallStringUtil.format("对局时间: {0}", timeStr)
        this.timesLabel.getComponent(cc.Label).string = SZFightReportModel.getInstance().getCurrentRound();
    }

    loadScoreList() {
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/fight_report_node');
        let cell = cc.instantiate(cellPrefab);
        let cellSize = cell.getContentSize();
        let roundDatas = SZFightReportModel.getInstance().getRoundDatas();
        let cellBindDatas = {
            times: { varName: "timesLabel" },
            detailBtn: { varName: "detailBtn", callback: this.detailCallback.bind(this) },
            scrollview: { varName: "scoreList" },
        };
        let playerDatas = SZFightReportModel.getInstance().getPlayers();
        let handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return roundDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    cell.timesLabel.color = cc.color(0xFF, 0xC8, 0x6C);
                    cell.timesLabel.getComponent(cc.Label).string = HallStringUtil.format("第{0}局", index + 1);
                    cell.detailBtn.tag = index;
                    this.loadRoundScroreList(cell.scoreList, index);
                    return cell;
            }
        };
        this.scoreList.getComponent("MyList").setHandler(handler.bind(this));
        this.scoreList.getComponent("MyList").reloadData();
    }

    loadRoundScroreList(scoreList, roundIndex) {
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/score_node');
        let cell = cc.instantiate(cellPrefab);
        let cellSize = cell.getContentSize();
        let roundDatas = SZFightReportModel.getInstance().getRoundDatas();
        let playerDatas = SZFightReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            label: { varName: "scoreLabel" }
        };
        let handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let roundPlayerData = SZFightReportModel.getInstance().getRoundsPlayer(roundIndex, playerData.user._id);
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    if (roundPlayerData) {
                        cell.scoreLabel.getComponent(cc.Label).string = String(roundPlayerData.win);
                    } else {
                        cell.scoreLabel.getComponent(cc.Label).string = "--";
                    }
                    return cell;
            }
        };
        scoreList.getComponent("MyList").setHandler(handler.bind(this));
        scoreList.getComponent("MyList").reloadData();
        scoreList.getComponent(cc.ScrollView).enabled = false;
    }

    loadTotalList() {
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/score_node');
        let cell = cc.instantiate(cellPrefab);
        let cellSize = cell.getContentSize();
        let playerDatas = SZFightReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            label: { varName: "scoreLabel" }
        };
        let handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    // cell.scoreLabel.color = cc.color(0xF3, 0xCA, 0x6B);
                    cell.scoreLabel.getComponent(cc.Label).string = SZFightReportModel.getInstance().getTotalScore(index);
                    return cell;
            }
        };
        this.totalList.getComponent("MyList").setHandler(handler.bind(this));
        this.totalList.getComponent("MyList").reloadData();
        this.totalList.getComponent(cc.ScrollView).enabled = false;
    }

    loadPlayerList() {
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/fightReport/fight_report_player');
        let cell = cc.instantiate(cellPrefab);
        let cellSize = cell.getContentSize();
        let playerDatas = SZFightReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            label: { varName: "nameLabel" },
            dayingjia: { varName: "bigWin" },
            yingbiao: { varName: "resultTag" },
            head: { varName: "head" },
            playerNode: { varName: "playerNode" },
            empty: { varName: "emptyNode" },
        };
        let handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return 5;//playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    if (index >= playerDatas.length) {
                        cell.playerNode.active = false;
                    } else {
                        cell.emptyNode.active = false;
                        cell.nameLabel.getComponent(cc.Label).string = playerData.user.nickname;
                        HallUIUtil.urlSprite(playerData.user.headimgurl, cell.head);
                        if (!SZFightReportModel.getInstance().isBigWin(playerData.user._id)) {
                            cell.bigWin.active = false;
                        }
                        let resultTagAtlas: cc.SpriteAtlas = h.resManager.getAtlasByName("res/images/atlas/budget");
                        if (playerData.score == 0) {
                            cell.resultTag.getComponent(cc.Sprite).spriteFrame = resultTagAtlas.getSpriteFrame("pingbiao");
                        } else if (playerData.score > 0) {
                            cell.resultTag.getComponent(cc.Sprite).spriteFrame = resultTagAtlas.getSpriteFrame("yingbiao");
                        } else {
                            cell.resultTag.getComponent(cc.Sprite).spriteFrame = resultTagAtlas.getSpriteFrame("shubiao");
                        }
                    }
                    return cell;
            }
        };
        this.playerList.getComponent("MyList").setHandler(handler.bind(this));
        this.playerList.getComponent("MyList").reloadData();
        this.playerList.getComponent(cc.ScrollView).enabled = false;
    }


    detailCallback(event) {
        let roundDatas = SZFightReportModel.getInstance().getRoundDatas();
        SZSingleBattleReportModel.getInstance().setRound(event.target.tag);
        SZSingleBattleReportController.showSingleBattleReportView(roundDatas[event.target.tag]);
    }

    closeCallback() {
        if (this.type == SZConstant.bigBudgetType.gaming) {
            h.viewManager.removeView(this);
        } else {
            h.viewManager.removeView(this);
            if (h.viewManager.getGameStartView()) {
                h.viewManager.popToGameStartView();
                SZHallController.showHallView();
            }
        }

    }

    shareCallback() {
        h.commonSDK.screenshot(cc.director.getScene(), null, function (filepath, filename) {
            h.commonSDK.shareImage(filepath);
        });
    }
}
