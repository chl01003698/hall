/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 13:37:22 
 * @Desc: 单局结算
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { ListDirection } from "../../../../../../../script/component/MyList";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { HallTimeUtil } from "../../../../../../../script/common/HallTimeUtil";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { DZSingleBattleReportController } from "./DZSingleBattleReportController";
import {DZBattleReportModel} from "../battleReport/DZBattleReportModel";
import {DZGameModel} from "../game/DZGameModel";
import { DZGameUtil } from "../../common/DZGameUtil";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
let controller_panel = require("controller_panel");

 export class DZSingleBattleReportView extends HallBaseView {
    private data:any = null;
    private index:number = null;
    private gameCountLabel:cc.Node;
    private tableCountLabel:cc.Node;
    private timeLabel:cc.Node;
    private configLabel:cc.Node;
    private shareBtn:cc.Node;
    private replayBtn:cc.Node;
    private timesTextLabel:cc.Node;

    constructor(data:any, isPlaying:boolean = false){
        super();
        this.data = data.data;
        this.index = data.index;
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            scrollview:{varName:"list"},
            list:{varName:"listBg"},
            duijvshu:{varName:"gameCountLabel"},
            zhuohao:{varName:"tableCountLabel"},
            shijian:{varName:"timeLabel"},
            config:{varName:"configLabel"},
            fenxiang:{varName:"shareBtn", callback:this.shareCallback.bind(this)},
            huifang:{varName:"replayBtn", callback:this.replayCallback.bind(this)},
            timesText:{varName:"timesTextLabel"}
        });
        this.showMaskView(true);
        this.setPrefab('res/prefab/singleBattleReport/zhanbao_danjv')
    }

    onPrefabLoaded(){
        this.refreshInfo();
        this.loadList();
    }

    refreshInfo(){
        this.replayBtn.active = false;
        if( DZBattleReportModel.getInstance().FN_GetShowAll()){
            this.replayBtn.active = true;
        }else {
            if(!DZBattleReportModel.getInstance().FN_GetIsGaming()) {
                this.replayBtn.active = true;
            }
        }
        this.gameCountLabel.getComponent(cc.Label).string = HallStringUtil.format("对局数: {0}/{1}", this.index, this.data.roundCount);
        this.tableCountLabel.getComponent(cc.Label).string = HallStringUtil.format("桌号: {0}", this.data.roomId);
        this.timeLabel.getComponent(cc.Label).string = HallStringUtil.format("时间: {0}", HallTimeUtil.getDateByFormat(this.data.createdAt, "MM-dd hh:mm:ss"));
        let configStr = "";
        for(let i in this.data.configStrs){
            configStr += "  " + this.data.configStrs[i];
        }
        this.configLabel.getComponent(cc.Label).string = configStr;
        let timesDatas = [
            {key:"lowCard",title:"抓底"},
            {key:"brandCard",title:"明牌"},
            {key:"bomb",title:"炸弹"},
            {key:"spring",title:"春天"},
            {key:"grabLandlord",title:"抢地主"},
        ];
        let timesStr = "";
        let playerData = this.data.rounds[0].players[0];
        for(let i in timesDatas){
            let timesData = timesDatas[i];
            if(playerData[timesData.key] && playerData[timesData.key] > 1 ){
                timesStr += "        " + HallStringUtil.format("{0}x{1}", timesData.title, playerData[timesData.key]);
            }else{
                //timesStr += "        " + HallStringUtil.format("{0}--", timesData.title);
            }
        }
        this.timesTextLabel.getComponent(cc.Label).string = timesStr;
    }

    loadList(){
        var resArray = null;
        var playerDatas = this.data.rounds[this.index - 1].players;
        var playerUserDatas = this.data.players;
        if(playerDatas.length <= 3){
            resArray = ['res/prefab/singleBattleReport/zhanbao_node_1', 'res/prefab/singleBattleReport/zhanbao_node_2'];
        }else{
            resArray = ['res/prefab/singleBattleReport/zhanbao_node_3', 'res/prefab/singleBattleReport/zhanbao_node_4'];
            this.list.getComponent("MyList").setDirection(ListDirection.HORIZONTAL);
            this.list.getComponent("MyList").space = 14;
            this.listBg.setPositionX(this.listBg.getPositionX() + 11)
            this.listBg.setPositionY(this.listBg.getPositionY() - 11)
        }
        var prefabName = resArray[0];
        var cell = cc.instantiate(h.resManager.getPrefabByName(prefabName));
        var cellSize = cell.getContentSize();
        let bindDatas = {
            name:{varName:"nameLabel"},
            id:{varName:"idLabel"},
            beishu:{varName:"timesLabel"},
            zhadanshu:{varName:"bombLabel"},
            fenshu:{varName:"scoreLabel"},
            dizhu:{varName:"landlordSprite"},
            shengli:{varName:"victorySprite"},
            scrollview:{varName:"cardList"}
        };

        var handler = function(funcName, list, index){
            switch(funcName){
                case "count":
                    return playerDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let playerData = playerDatas[index];
                    let playerUserData = playerUserDatas[index];
                    let prefab = h.resManager.getPrefabByName(prefabName);
                    let cell = cc.instantiate(prefab);
                    HallUIUtil.bind(bindDatas, cell);
                    if( DZBattleReportModel.getInstance().FN_GetShowAll()){
                        cell.nameLabel.getComponent(cc.Label).string =DZGameModel.getInstance().getUserNickName(playerUserData.uid);
                    }else{
                        if(DZBattleReportModel.getInstance().FN_GetIsGaming()){
                            cell.nameLabel.getComponent(cc.Label).string =DZGameModel.getInstance().getUserNickName(playerUserData.uid);
                        }else{
                            cell.nameLabel.getComponent(cc.Label).string = playerUserData.user.nickname;
                        }
                    }
                    if( DZBattleReportModel.getInstance().FN_GetShowAll()){
                        cell.idLabel.getComponent(cc.Label).string =DZGameModel.getInstance().getShortId(playerUserData.uid);
                    }else{
                        if(DZBattleReportModel.getInstance().FN_GetIsGaming()){
                            cell.idLabel.getComponent(cc.Label).string =DZGameModel.getInstance().getShortId(playerUserData.uid);
                        }else{
                            cell.idLabel.getComponent(cc.Label).string = "ID: " + playerUserData.user.shortId;
                        }
                    }

                    if(cell.timesLabel){
                        cell.timesLabel.getComponent(cc.Label).string = playerUserData.multiple;
                    }
                    cell.bombLabel.getComponent(cc.Label).string = playerData.bomb;
                    cell.scoreLabel.getComponent(cc.Label).string = playerData.win;
                    cell.landlordSprite.active = playerData.type == "landlord";
                    cell.victorySprite.active = playerData.victory != 0;
                    let cardsTemp = {}
                    for(let index in playerData.cards){
                        cardsTemp[playerData.cards[index]] = true;
                    }
                    let cards:any[] = [];
                    for(let index in playerData.tmpCards){
                        if(cardsTemp[playerData.tmpCards[index]]){
                            cards.push(playerData.tmpCards[index]);
                        }
                    }
                    for(let index in playerData.tmpCards){
                        if(!cardsTemp[playerData.tmpCards[index]]){
                            cards.push(playerData.tmpCards[index]);
                        }
                    }
                    if(cell.cardList){
                        var handler = function(funcName, list, index){
                            switch(funcName){
                                case "count":
                                    return cards.length;
                                case "cellSize":
                                    var cellSize = cc.size(20, 84);
                                    return cellSize;
                                case "cell":
                                    let num = cards[index];
                                    var pokerPrefab =  h.resManager.getPrefabByName("res/prefab/poker/pai_Item");
                                    let cell = cc.instantiate(pokerPrefab);
                                    let pokerItem = cell.getComponent('pokerItem');
                                    cell.scale = 0.5;
                                    pokerItem.initPaiMian(num);
                                    pokerItem.setMaskActive(cardsTemp[num] != true)
                                    return cell;
                            }
                        }
                        cell.cardList.getComponent("MyList").setHandler(handler);
                        cell.cardList.getComponent("MyList").reloadData();
                        cell.cardList.getComponent(cc.ScrollView).enabled = false;
                    }

                    var selfId = HallUserModel.getInstance().getUserID();
                    if( playerData.playerId != selfId ){
                        var bg  = cc.find( "di", cell );
                        let yxzPlist = h.resManager.getAtlasByName('res/images/atlas/zhanbao');
                        bg.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_danju_dizi01");
                    }

                    return cell;
            }
        }.bind(this);

        this.list.getComponent("MyList").setHandler(handler);
        this.list.getComponent("MyList").reloadData();
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }

    shareCallback(){
        h.commonSDK.screenshot(cc.director.getScene(), null, function(filepath, filename){
            h.commonSDK.shareImage(filepath);
        });
    }

    replayCallback(){
        h.log.debug("&&&回放。。。this.data = " + this.data);
        let playbackId = this.data.playbackIds[this.index-1];
        h.log.debug("&&&回放。。。playbackId = " + playbackId);
        DZSingleBattleReportController.replay(playbackId);
    }
 }
