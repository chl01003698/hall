/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 11:18:14 
 * @Desc: 三张
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

 export class SZFightRecordModel extends HallBaseModel {
    private static instance:SZFightRecordModel = null;
    private fightRecordList:any[] = [];

    static getInstance():SZFightRecordModel {
        if(!this.instance){
            this.instance = new SZFightRecordModel();
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