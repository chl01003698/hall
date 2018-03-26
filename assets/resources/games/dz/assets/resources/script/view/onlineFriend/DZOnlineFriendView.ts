/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示京东卡界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {DZOnlineFriendModel} from "./DZOnlineFriendModel";
 export class DZOnlineFriendView extends HallBaseView {
     private m_onlineFriend:any = null;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/friend/youxizhong_yaohaoyou");
    }

    onPrefabLoaded(){
        this.m_onlineFriend = this.getPrefabNode().getComponent('DZOnlineFriend');
        var friendlist = DZOnlineFriendModel.getInstance().FN_GetFriendData();
        if(friendlist.length <= 0){
            this.m_onlineFriend.nofriend.active = true;
        }else{
            this.m_onlineFriend.nofriend.active = false;
            this.m_onlineFriend.initOnlineFriendList(friendlist);
        }
    }

    closeCallback(){
         h.viewManager.removeView(this);
     }
 }
