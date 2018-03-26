/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 16:42:44 
 * @Desc: 大厅数据
 */

import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

 export class DZHallModel extends HallBaseModel {

    private static instance:DZHallModel;
    // 跑马灯数据
    private tips:string[] = ["新年过节好","你好我好大家好", "666", "999", "888"];

    static getInstance():DZHallModel{
        if (!this.instance){
            this.instance = new DZHallModel();
        }
        return this.instance;
    }

    setTips(tips:string[]){
        this.tips = tips;
    }

    getTips():string[]{
        return this.tips;
    }
 }
