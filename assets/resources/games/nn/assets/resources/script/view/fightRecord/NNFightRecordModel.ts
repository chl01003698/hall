/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 11:18:14 
 * @Desc: 三张
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

 export class NNFightRecordModel extends HallBaseModel {
    private static instance:NNFightRecordModel = null;
    private fightRecordList:any[] = [];

    static getInstance():NNFightRecordModel {
        if(!this.instance){
            this.instance = new NNFightRecordModel();
        }
        return this.instance;
    }

    setFightRecordList(data){
        this.fightRecordList = data;
    }

    getFightRecordList():any[]{
        return this.fightRecordList ;
   }

 }