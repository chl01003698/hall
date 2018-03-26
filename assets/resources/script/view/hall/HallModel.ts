/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-22 18:38:39 
 * @Desc: 大厅数据
 */

import { HallBaseModel } from "../../common/HallBaseModel";

 export class HallModel extends HallBaseModel {
    private static instance:HallModel = null;
    private restoreGameInfo:any = null;
    private config:any = null;
    private tips:any[] = null;

    static getInstance():HallModel {
        if(!this.instance){
            this.instance = new HallModel();
        }
        return this.instance;
    }

    // setRestoreGameInfo(gameInfo){
    //     this.restoreGameInfo = gameInfo;
    // }

    // getRestoreGameInfo(){
    //     return this.restoreGameInfo;
    // }

    getConfig():any{
        return this.config;
    }

    setConfig(config:any){
        this.config = config;
    }

    setTips(tips){
        this.tips = tips;
    }

    getTips(){
        return ["test1", "test2", "test3", "test4"];
        //return this.tips;
    }
 }
