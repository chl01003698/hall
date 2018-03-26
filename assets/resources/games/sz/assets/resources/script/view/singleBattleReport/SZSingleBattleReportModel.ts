/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 21:57:12 
 * @Desc: 三张单局结算
 */

import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { h } from "../../../../../../../script/common/H";

export enum SZBattleResult{
    win = 0,
    lose = 1,
    giveUp = 2,
}
 export class SZSingleBattleReportModel extends HallBaseModel {
    private static instance:SZSingleBattleReportModel = null;
    private data:any;
    private round:number;

    static getInstance():SZSingleBattleReportModel {
        if(!this.instance){
            this.instance = new SZSingleBattleReportModel();
        }
        return this.instance;
    }

    setData(data){
        this.data = data;
    }

    getData():any[]{
        return this.data;
   }

   getPlayers():any[]{
       return this.data.players;
   }

   setRound(round){
    this.round = round;
   }

   getRound(){
       return this.round;
   }

   getBattleResult(playerData):SZBattleResult{
       let battleResult:SZBattleResult;
       if(playerData.giveup == true){
            battleResult = SZBattleResult.giveUp;
       }else{
            if(playerData.victory >= 1){
                battleResult = SZBattleResult.win;
            }else{
                battleResult = SZBattleResult.lose;
            }
       }
       return battleResult;
   }
 }