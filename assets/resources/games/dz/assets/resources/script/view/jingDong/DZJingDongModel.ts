/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 京东卡数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";

export class DZJingDongModel extends HallBaseModel {
    private m_inviteNum:any = 0;
    private m_friendList:any;
    private m_reward:any = [];
    private static instance: DZJingDongModel = null;
    static getInstance(): DZJingDongModel {
        if (this.instance == null) {
            this.instance = new DZJingDongModel();
        }
        return this.instance;
    }

    FN_GetInviteNum():any{
        return this.m_inviteNum;
    }

    FN_SetInviteNum(num:any){
        this.m_inviteNum = num;
    }

    FN_SetFriendList(list){
        this.m_friendList = list;
    }

    FN_GetFriendList():any{
        return this.m_friendList;
    }

    FN_SetReward(reward){
        this.m_reward = reward;
    }

    FN_GetReward():any{
        return this.m_reward;
    }

    FN_AddReward(reward){
        this.m_reward.push(reward);
    }

}