/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 11:47:01 
 * @Desc: 好友
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { DZFriendModel } from "./DZFriendModel";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import { DZFriendController } from "./DZFriendController";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallNetConfig } from "../../../../../../../script/net/HallNetConfig";
import { DZToast } from "../common/DZToast";
import { DZGameSelfInfoController } from "../gameSelfInf/DZGameSelfInfoController";

enum ViewType {
    friend = 0,
    newFriend = 1
}

export enum DZFriendViewFromType {
    normal = 0,
    game = 1
}
export class DZFriendView extends HallBaseView {
    private viewType:ViewType = ViewType.friend;
    private friendTipLabel:cc.Node;
    private newFriendTipLabel:cc.Node;
    private friendBtn:cc.Node;
    private newFriendBtn:cc.Node;
    private friendDatas:any[] = [];
    private fromType:DZFriendViewFromType = null;

    constructor(fromType:DZFriendViewFromType = DZFriendViewFromType.normal) {
        super();
        this.fromType = fromType;
        this.setBindDatas({
            x: { callback: this.closeCallback.bind(this) },
            anniu: { callback: this.addWxFriendCallback.bind(this) },
            anniu1: { varName: "friendBtn", callback: this.friendCallback.bind(this) },
            anniu2: { varName: "newFriendBtn", callback: this.newFriendCallback.bind(this) },
            AllScrollView: { varName: "list" },
            friendTip: { varName: "friendTipLabel" },
            newFriendTip: { varName: "newFriendTipLabel" },
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/friend/haoyou_list");
    }

    onPrefabLoaded() {
        this.refreshList();
    }

    refreshList() {
        let friendDatas:any[] = DZFriendModel.getInstance().getFriendDatas();
        var prefabName = "res/prefab/friend/wode_haoyou";
        if(this.viewType == ViewType.newFriend){
            friendDatas = DZFriendModel.getInstance().getNewFriendDatas();
            prefabName = "res/prefab/friend/new_haoyou";
        }
        this.friendDatas = friendDatas;
        var prefab = h.resManager.getPrefabByName(prefabName);
        let cell = cc.instantiate(prefab);
        var cellSize = cell.getContentSize();
        let cellBindDatas = {
            gameState: { varName: "freeLabel" },
            state: { varName: "onlineLabel" },
            playerName: { varName: "playerNameLabel" },
            head: { varName: "headSprite" },
            x:{varName:"refuseBtn", callback:this.refuseCallback.bind(this)},
            ok:{varName:"confirmBtn", callback:this.confirmCallback.bind(this)},
            yaoqing:{varName:"inviteBtn", callback:this.inviteCallback.bind(this)},
            jiaru:{varName:"joinBtn", callback:this.joinCallback.bind(this)},
            offline:{varName:"offlineLabel"},
            online:{varName:"onlineLabel"},
            kuang:{varName:"headBtn", callback:this.headCallback.bind(this)},
        }
        h.log.debug("gege===", friendDatas);
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return friendDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var cell = cc.instantiate(prefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    let friendData:any = friendDatas[index];
                    cell.playerNameLabel.getComponent(cc.Label).string = friendData.nickname;
                    if(this.viewType == ViewType.newFriend){
                        cell.refuseBtn.tag = index;
                        cell.confirmBtn.tag = index;
                    }
                    cell.headBtn.tag = index;
                    if(cell.inviteBtn){
                        cell.inviteBtn.active = false;
                        cell.inviteBtn.tag = index;
                    }
                    if(cell.joinBtn){
                        cell.joinBtn.active = false;
                        cell.joinBtn.tag = index;;
                    }
                    if(friendData.online){
                        cell.offlineLabel.active = false;
                        if(this.fromType == DZFriendViewFromType.game){
                            cell.inviteBtn.active = true;
                        }
                    }else{
                        cell.onlineLabel.active = false;
                    }
                    if(friendData.status == "ready" && this.fromType == DZFriendViewFromType.normal){
                        cell.joinBtn.active = true;
                    }
                    HallUIUtil.urlSprite(friendData.headimgurl, cell.head);
                    return cell;
            }
        }.bind(this);
        this.list.getComponent("MyList").setHandler(handler);
        this.list.getComponent("MyList").reloadData();
        if(HallUtil.isEmpty(friendDatas)){
            this.friendTipLabel.active = this.viewType == ViewType.friend;
            this.newFriendTipLabel.active = this.viewType == ViewType.newFriend;
        }else{
            this.friendTipLabel.active = false;
            this.newFriendTipLabel.active = false;
        }
    }

    updateList(){
        if(this.viewType == ViewType.friend){
            //DZFriendController.getFriend(function(){
                this.refreshList();
            //}.bind(this));
        }else{
            //DZFriendController.getPendingFriend(function(){
                this.refreshList();
            //}.bind(this));
        }
    }

    inviteCallback(event) {
        let index = event.target.tag;
        let friendData = this.friendDatas[index];
        DZFriendController.inviteJoinGame(function(){
            DZToast.show("邀请成功");
            this.updateList();
        }.bind(this), friendData.shortId);
    }
    confirmCallback(event){
        let index = event.target.tag;
        let friendData = this.friendDatas[index];
        DZFriendController.agree(function(){
            DZToast.show("添加成功");
            this.updateList();
        }.bind(this), friendData.shortId);
    }

    refuseCallback(event){
        let index = event.target.tag;
        let friendData = this.friendDatas[index];
        DZFriendController.removeFriend(function(){
            DZToast.show("拒绝成功");
            this.updateList();
        }.bind(this), friendData.shortId);
    }

    headCallback(event) {
        let index = event.target.tag;
        let friendData = this.friendDatas[index];
        DZGameSelfInfoController.showGameSelfInfoView(friendData.shortId);
    }

    joinCallback(event) {
        let index = event.target.tag;
        let friendData = this.friendDatas[index];
        DZFriendController.joinFriendGame(function(){

        }, friendData.shortId);
    }

    friendCallback() {
        DZFriendController.getFriend(function(){
            this.viewType = ViewType.friend;
            this.refreshList();
            this.friendBtn.opacity = 255;
            this.newFriendBtn.opacity = 0;
        }.bind(this));
    }

    newFriendCallback() {
        DZFriendController.getPendingFriend(function(){
            this.viewType = ViewType.newFriend;
            this.refreshList();
            this.friendBtn.opacity = 0;
            this.newFriendBtn.opacity = 255;
        }.bind(this));
    }

    addWxFriendCallback() {
        let data = HallUtil.deepCopy(HallNetConfig.webpage.inviteFriend);
        data.url += "&shortId=" + HallUserModel.getInstance().getShortID();
        HallController.shareWebpage(data);
    }

    closeCallback() {
        h.viewManager.removeView(this);
    }
}
