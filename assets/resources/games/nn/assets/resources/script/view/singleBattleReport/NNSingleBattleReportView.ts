/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 22:04:57 
 * @Desc: 文件描述
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { NNSingleBattleReportModel } from "./NNSingleBattleReportModel";
import { NNFightReportModel } from "../fightReport/NNFightReportModel";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";

export class NNSingleBattleReportView extends HallBaseView {

        constructor(){
            super();
            this.setBindDatas({
                x:{callback:this.closeCallback.bind(this)},
                share:{varName:"shareBtn", callback:this.shareCallback.bind(this)},
                ready:{varName:"readyBtn", callback:this.readyCallback.bind(this)},
                tableIdLabel:{varName:"tableIdLabel"},
                jushu:{varName:"timesLabel"},
                scrollview:{varName:"playerList"},
            });
            this.setPrefab("res/prefab/budget/budget");
            this.showMaskView(true);
        }

        onPrefabLoaded(){
            this.loadPlayerList();
            this.refreshInfo();
        }

        refreshInfo(){
            this.tableIdLabel.getComponent(cc.Label).string = NNFightReportModel.getInstance().getTableId();
            this.timesLabel.getComponent(cc.Label).string = HallStringUtil.format("第{0}局)", NNSingleBattleReportModel.getInstance().getRound() + 1);
        }

        loadPlayerList(){
            let cellPrefab = h.resManager.getPrefabByName('res/prefab/budget/budgetItem');
            let cell = cc.instantiate(cellPrefab) ;
            let cellSize = cell.getContentSize() ;
            let playerDatas = NNSingleBattleReportModel.getInstance().getPlayers();
            let cellBindDatas = {
                name:{varName:"nameLabel"},
                score:{varName:"scoreLabel"},
                type:{varName:"resultTag"},
                head:{varName:"head"},
                poker:{varName:"pokerLayer"},
            };
            let handler = function(funcName, list, index){
                switch(funcName){
                    case "count":
                        return playerDatas.length;
                    case "cellSize":
                        return cellSize;
                    case "cell":
                        let playerData = playerDatas[index];
                        let playerDataExtern = NNFightReportModel.getInstance().getPlayer(playerData.uid);
                        let cell = cc.instantiate(cellPrefab);
                        HallUIUtil.bind(cellBindDatas, cell);
                        cell.nameLabel.getComponent(cc.Label).string = playerDataExtern.user.nickname;
                        HallUIUtil.urlSprite(playerDataExtern.user.headimgurl, cell.head);
                        cell.scoreLabel.getComponent(cc.Label).string = playerData.win;
                        for(let i = 0; i < playerData.cards.length; ++i) {
                            let pokerPreb = h.resManager.getPrefabByName("res/prefab/poker/pai_Item");
                            let poker = cc.instantiate(pokerPreb).getComponent('NNpokerItem');
                            poker.initPoker(playerData.cards[i]);
                            poker.setScale(0.8);
                            cell.pokerLayer.addChild(poker.node);
                        }
                        return cell;
                }
            };
            this.playerList.getComponent("MyList").setHandler(handler.bind(this));
            this.playerList.getComponent("MyList").reloadData();
            this.playerList.getComponent(cc.ScrollView).enabled = false;
        }

        closeCallback(){
            h.viewManager.removeView(this);
        }

        readyCallback(){

        }

        shareCallback(){

        }
}