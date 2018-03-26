/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 22:04:57 
 * @Desc: 文件描述
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { SZSingleBattleReportModel, SZBattleResult } from "./SZSingleBattleReportModel";
import { SZFightReportModel } from "../fightReport/SZFightReportModel";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";

export class SZSingleBattleReportView extends HallBaseView {

    constructor() {
        super();
        this.setBindDatas({
            x: { callback: this.closeCallback.bind(this) },
            share: { varName: "shareBtn", callback: this.shareCallback.bind(this) },
            next: { varName: "nextBtn", callback: this.nextCallback.bind(this) },
            tableIdLabel: { varName: "tableIdLabel" },
            jushu: { varName: "timesLabel" },
            scrollview: { varName: "playerList" },
            last:{varName:"lastBtn", callback:this.lastCallback.bind(this)},
        });
        this.setPrefab("res/prefab/budget/budget");
        this.showMaskView(true);
    }

    onPrefabLoaded() {
        this.lastBtn.active = false;
        let roundDatas = SZFightReportModel.getInstance().getRoundDatas();
        if(roundDatas.length <= 1){
            this.nextBtn.enabled = false;
        }
        this.refresh();
    }

    refreshInfo() {
        this.tableIdLabel.getComponent(cc.Label).string = SZFightReportModel.getInstance().getTableId();
        this.timesLabel.getComponent(cc.Label).string = HallStringUtil.format("第{0}局)", SZSingleBattleReportModel.getInstance().getRound() + 1);
    }

    refresh() {
        this.refreshPlayerList();
        this.refreshInfo();
    }

    refreshPlayerList() {
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/budget/budgetItem');
        let cell = cc.instantiate(cellPrefab);
        let cellSize = cell.getContentSize();
        let playerDatas = SZSingleBattleReportModel.getInstance().getPlayers();
        let cellBindDatas = {
            name: { varName: "nameLabel" },
            score: { varName: "scoreLabel" },
            type: { varName: "resultTag" },
            head: { varName: "head" },
            poker: { varName: "pokerLayer" },
        };
        let handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let playerDataExtern = SZFightReportModel.getInstance().getPlayer(playerData.uid);
                    let cell = cc.instantiate(cellPrefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    if (playerDataExtern) {
                        cell.nameLabel.getComponent(cc.Label).string = playerDataExtern.user.nickname;
                        HallUIUtil.urlSprite(playerDataExtern.user.headimgurl, cell.head);
                        cell.scoreLabel.getComponent(cc.Label).string = playerData.win;
                        for (let i = 0; i < playerData.cards.length; ++i) {
                            let pokerPreb = h.resManager.getPrefabByName("res/prefab/poker/pai_Item");
                            let poker = cc.instantiate(pokerPreb).getComponent('SZpokerItem');
                            poker.initPoker(playerData.cards[i]);
                            poker.setScale(0.8);
                            cell.pokerLayer.addChild(poker.node);
                        }
                        let battleResult: SZBattleResult = SZSingleBattleReportModel.getInstance().getBattleResult(playerData);
                        let frameName;
                        if (battleResult == SZBattleResult.giveUp) {
                            frameName = "qibiao";
                        } else if (battleResult == SZBattleResult.win) {
                            frameName = "yingbiao";
                        } else {
                            frameName = "shubiao";
                        }
                        let resultTagAtlas: cc.SpriteAtlas = h.resManager.getAtlasByName("res/images/atlas/budget");
                        cell.resultTag.getComponent(cc.Sprite).spriteFrame = resultTagAtlas.getSpriteFrame(frameName);
                    }
                    return cell;
            }
        };
        this.playerList.getComponent("MyList").setHandler(handler.bind(this));
        this.playerList.getComponent("MyList").reloadData();
        this.playerList.getComponent(cc.ScrollView).enabled = false;
    }

    closeCallback() {
        h.viewManager.removeView(this);
    }

    nextCallback() {
        let roundDatas = SZFightReportModel.getInstance().getRoundDatas();
        let roundIndex = SZSingleBattleReportModel.getInstance().getRound();
        if (roundIndex < roundDatas.length - 1) {
            ++roundIndex;
            if(roundIndex >= roundDatas.length - 1){
                this.nextBtn.active = false;
                this.lastBtn.active = true;
            }
            SZSingleBattleReportModel.getInstance().setRound(roundIndex);
        }
        SZSingleBattleReportModel.getInstance().setData(roundDatas[roundIndex]);
        this.refresh();
    }

    lastCallback(){
        let roundDatas = SZFightReportModel.getInstance().getRoundDatas();
        let roundIndex = SZSingleBattleReportModel.getInstance().getRound();
        if (roundIndex > 0) {
            --roundIndex;
            if(roundIndex <= 0){
                this.nextBtn.active = true;
                this.lastBtn.active = false;
            }
            SZSingleBattleReportModel.getInstance().setRound(roundIndex);
        }
        SZSingleBattleReportModel.getInstance().setData(roundDatas[roundIndex]);
        this.refresh();
    }
    shareCallback() {

    }
}