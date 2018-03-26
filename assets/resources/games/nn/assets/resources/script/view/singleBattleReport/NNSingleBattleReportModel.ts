/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 21:57:12 
 * @Desc: 三张单局结算
 */

import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

 export class NNSingleBattleReportModel extends HallBaseModel {
    private static instance:NNSingleBattleReportModel = null;
    private data:any;
    private round:number;

    static getInstance():NNSingleBattleReportModel {
        if(!this.instance){
            this.instance = new NNSingleBattleReportModel();
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
 }