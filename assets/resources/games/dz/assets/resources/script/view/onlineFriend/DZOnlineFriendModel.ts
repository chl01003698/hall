/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 京东卡数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";

export class DZOnlineFriendModel extends HallBaseModel {
    private static instance: DZOnlineFriendModel = null;
    private m_friendData:any;
    static getInstance(): DZOnlineFriendModel {
        if (this.instance == null) {
            this.instance = new DZOnlineFriendModel();
        }
        return this.instance;
    }

    FN_SetFriendData(data:any){
        this.m_friendData = data;
    }

    FN_GetFriendData():any{
        return this.m_friendData;
    }
}