/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-11 14:47:52 
 * @Desc: 文件描述
 */


import { HallBaseModel } from "../../common/HallBaseModel";

export class HallDismissModel extends HallBaseModel {

    private static instance: HallDismissModel = null;
    private dismissData: any = null;

    static getInstance(): HallDismissModel {
        if (this.instance == null) {
            this.instance = new HallDismissModel();
        }
        return this.instance;
    }
    //设置解散数据
    public setDismissData(data: any) {
        this.dismissData = data;
    }
    //取解散数据
    public getDismissData():any{
        return this.dismissData;
    }
}