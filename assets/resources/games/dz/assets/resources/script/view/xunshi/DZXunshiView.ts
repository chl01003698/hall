/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-22 21:31:26 
 * @Desc: 巡视
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";

 export class DZXunshiView extends HallBaseView {
    private tableCountLabel:cc.Node;
    private playerCountLabel:cc.Node;
    private cardCountLabel:cc.Node;
    private list:cc.Node;

    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            kuaisukaizhuo:{callback:this.fastOpenTableCallback.bind(this)},
            kaizhuo:{callback:this.openTableCallback.bind(this)},
            tableCount:{varName:"tableCountLabel"},
            playerCount:{varName:"playerCountLabel"},
            cardCount:{varName:"cardCountLabel"},
            scrollview:{varName:"list"},
        });
        this.showMaskView(true)
        this.setPrefab("res/prefab/xunshi/xunshi");
    }

    onPrefabLoaded(){
        this.loadList();
    }

    loadList(){
        var prefab = h.resManager.getPrefabByName("res/prefab/xunshi/xunshi_zhuozi_node");
        let cell = cc.instantiate(prefab);
        var cellSize = cell.getContentSize()
        let tableDatas = [1,1,15,5,5];
        let cellBindDatas = {
            fenxiang: {varName:"wxFriendBtn", callback:this.wxFriendCallback.bind(this)},
            dianjikaizhuo:{varName:"onlineFriendBtn", callback:this.onlineFriendCallback.bind(this)},
        }
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return tableDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var cell = cc.instantiate(prefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    var tableData = tableDatas[index];
                    cell.wxFriendBtn.tag = index;
                    cell.onlineFriendBtn.tag = index;
                    return cell;
            }
        }
        this.list.getComponent("MyList").setHandler(handler);
        this.list.getComponent("MyList").reloadData();
    }

    wxFriendCallback(event){
        h.log.debug("wxFriendCallback", event.target.tag);
    }

    onlineFriendCallback(){

    }


    closeCallback(){
        h.viewManager.removeView(this);
    }

    fastOpenTableCallback(){

    }

    openTableCallback(){

    }
 }
