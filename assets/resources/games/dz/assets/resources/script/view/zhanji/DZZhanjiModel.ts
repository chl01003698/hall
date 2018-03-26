/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 22:19:06 
 * @Desc: 战绩数据
 */

import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

export class DZZhanjiModel extends HallBaseModel {
    private static instance:DZZhanjiModel = null;
    private fightRecordList:any[] = [];

    static getInstance():DZZhanjiModel {
        if(!this.instance){
            this.instance = new DZZhanjiModel();
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