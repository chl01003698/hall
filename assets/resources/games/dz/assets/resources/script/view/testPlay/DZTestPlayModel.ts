/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 试玩数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";

export class DZTestPlayModel extends HallBaseModel {
    private m_weChat:any =  '';
    private m_items:any;
    private static instance: DZTestPlayModel = null;
    static getInstance(): DZTestPlayModel {
        if (this.instance == null) {
            this.instance = new DZTestPlayModel();
        }
        return this.instance;
    }
    FN_SetWeChat(chat){
        this.m_weChat = chat;
    }
    FN_GetWeChat ():any {
        return  this.m_weChat;
    }

    FN_SetImageItems(items){
        this.m_items = items;
    }
    FN_GetImageItems ():any {
        return  this.m_items;
    }
}