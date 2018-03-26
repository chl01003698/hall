/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 22:17:21 
 * @Desc: 战绩
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { DZZhanjiModel } from "./DZZhanjiModel";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { DZZhanjiController } from "./DZZhanjiController";
import { DZConstant } from "../../common/DZConstant";
import { HallTimeUtil } from "../../../../../../../script/common/HallTimeUtil";
import {DZBattleReportModel} from "../battleReport/DZBattleReportModel";
import {DZBattleReportController} from "../battleReport/DZBattleReportController";

 export class DZZhanjiView extends HallBaseView {

     private m_nodata:cc.Node;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            scrollview:{varName:"list"},
            noData:{varName:'m_nodata'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/zhanji/zhanji");
    }

    onPrefabLoaded(){
        DZZhanjiController.getRecords(function(){
            this.loadList();
        }.bind(this), DZConstant.gameName);
    }

    loadList(){
        let cellPrefab = h.resManager.getPrefabByName('res/prefab/zhanji/zhanji_node');       
        var cell = cc.instantiate(cellPrefab) ;
        var cellSize = cell.getContentSize() ;
        var fightList = DZZhanjiModel.getInstance().getFightRecordList() ;
        fightList.length > 0 ? this.m_nodata.active = false:this.m_nodata.active = true;
        var handler = function(funcName, list, index){
            switch(funcName){
                case "count":
                    return fightList.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var data = fightList[index];
                    data.index = index;
                    var item = this.getItem(cellPrefab, data) ;
                    return item;
            }
        };
        this.list.getComponent("MyList").setHandler(handler.bind(this));
        this.list.getComponent("MyList").reloadData();
    }

    getItem(prefab, data){
        let bindDatas = {
            index:{varName:"indexLabel"},
            tableNum:{varName:"tableNumLabel"},
            num1:{varName:"roundLabel"},
            num2:{varName:"maxRoundLabel"},
            nianyueri:{varName:"time1Label"},
            shifenmiao:{varName:"time2Label"},
            anniu:{varName:"reviewBtn", callback:this.reviewZhanjiCallback.bind(this)},
            name:{varName:"nameNode"},
            fenshu:{varName:"fenshuNode"}
        }
        let cell = cc.instantiate(prefab);
        HallUIUtil.bind(bindDatas, cell);
        cell.indexLabel.getComponent(cc.Label).string = data.index + 1;
        cell.tableNumLabel.getComponent(cc.Label).string = data.roomId;
        cell.roundLabel.getComponent(cc.Label).string = HallStringUtil.format("{0}/{1}", data.currentRound, data.roundCount);
        cell.time1Label.getComponent(cc.Label).string = HallTimeUtil.getDateStr(new Date(data.createdAt).getTime());
        cell.reviewBtn.tag = data.index;
        for(var i = 0; i < 4; ++i){
            var player = data.players[i];
            // 昵称
            var nickName = cc.find(HallStringUtil.format('{0}p', i + 1), cell.nameNode).getComponent(cc.Label) ;
            // 分数
            var score = cc.find(HallStringUtil.format('{0}p', i + 1), cell.fenshuNode).getComponent(cc.Label) ;
            if(player != null){
                nickName.string = String(data.players[i].user.nickname);
                score.string = String(data.players[i].score);
            }else{
                nickName.string = "";
                score.string = "";
            }
        }
        return cell;
    }

    reviewZhanjiCallback(event){
        h.log.debug(event.target.tag);
        var totalData = DZZhanjiModel.getInstance().getFightRecordList()[event.target.tag];
        DZBattleReportModel.getInstance().FN_SetShowAll(false);
        DZBattleReportModel.getInstance().FN_SetIsGaming(false);
        DZBattleReportModel.getInstance().FN_SetTotalData(totalData);
        // DZBattleReportModel.getInstance().FN_SetPlayInfoList(totalData.players);
        // DZBattleReportModel.getInstance().FN_SetGameInfoList(totalData.rounds);
        DZBattleReportController.showBattleReportView();
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }