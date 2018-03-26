/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:14:31 
 * @Desc: 文件描述
 */

import { HallView } from "../../../../../../../script/view/hall/HallView";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { SZcreateTableControler } from "../createTable/SZcreateTableControler";
import { SZJoinTableController } from "../join/SZJoinTableController";
import { HallFriendController } from "../../../../../../../script/view/friend/HallFriendController";
import { SZFightRecordController } from "../fightRecord/SZFightRecordController";

 export class SZHallView extends HallView {
     spe: cc.Node;
    
    constructor(){
        super();
        this.setBindDatas({
            kaizhuo:{varName:"openBtn", callback:this.openCallback.bind(this)}, 
            fanhuijian:{callback:this.backCallback.bind(this)},
            jinzhuo:{callback:this.joinCallback.bind(this)},
            // 好友列表
            hylbBtn: { callback: this.hylbCallback.bind(this) },
            zhanji:{callback:this.fightRecordCallback.bind(this)}
        });
        this.setPrefab("res/prefab/hall/hall"); 
    }

    openCallback(){
        SZcreateTableControler.showCreateTableView();
    }

    backCallback(){
        HallController.showHallView();
    }

    joinCallback() {
        SZJoinTableController.showJoinTableView();
    }

    onPrefabLoaded() {
        SZcreateTableControler.getTableInfo(null);
    }

    /**
     * 好友列表
     */
    hylbCallback() {
        HallFriendController.showFriendView();
    }

    /**
     * 战绩
     */
    fightRecordCallback(){
        SZFightRecordController.showFightRecordView();
        //SZFightRecordController.showFightRecordView();
    }
}