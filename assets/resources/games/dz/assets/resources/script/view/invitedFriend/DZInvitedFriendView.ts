/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示已邀好友界面
 */

import { h } from "../../../../../../../script/common/H";
import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { HallTimeUtil } from "../../../../../../../script/common/HallTimeUtil";
import {DZJingDongModel} from "../jingDong/DZJingDongModel";

export class DZInvitedFriendView extends HallBaseView {
    private list: cc.Node;
    private m_friendNum:cc.Node;
    constructor() {
        super();
        this.setBindDatas({
            x: { callback: this.closeCallback.bind(this) },
            queding: { callback: this.inviteCallBack.bind(this) },
            scrollview: { varName: "list" },
            friendNum: { varName: "m_friendNum" },
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/invitedFriend/yiyaohaoyou");
    }

    onPrefabLoaded() {
        let friendLabel = this.m_friendNum.getComponent(cc.Label);
        friendLabel.string =String(DZJingDongModel.getInstance().FN_GetInviteNum());
        this.loadList();
    }

    loadList() {
        var prefab = h.resManager.getPrefabByName("res/prefab/invitedFriend/yiyaohaoyou_node");
        let cell = cc.instantiate(prefab);
        var cellSize = cell.getContentSize()
        var friendDatas = DZJingDongModel.getInstance().FN_GetFriendList()||[];//[{ name: "23423", date: 22 }];
        let cellBindDatas = {
            name: { varName: "nameLabel" },
            time: { varName: "timeLabel" },
        }
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return friendDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var cell = cc.instantiate(prefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    var friendData = friendDatas[index];
                    cell.nameLabel.getComponent(cc.Label).string = friendData.nickname;
                    cell.timeLabel.getComponent(cc.Label).string = HallTimeUtil.getDateStr(friendData.createdAt);
                    return cell;
            }
        }
        this.list.getComponent("MyList").setHandler(handler);
        this.list.getComponent("MyList").reloadData();
    }

    inviteCallBack() {

    }

    closeCallback() {
        h.viewManager.removeView(this);
    }
}
