/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:14:31 
 * @Desc: 文件描述
 */

import { HallView } from "../../../../../../../script/view/hall/HallView";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { NNcreateTableControler } from "../createTable/NNcreateTableControler";
import { NNJoinTableController } from "../join/NNJoinTableController";
import { HallFriendController } from "../../../../../../../script/view/friend/HallFriendController";
import { NNFightRecordController } from "../fightRecord/NNFightRecordController";

 export class NNHallView extends HallView {
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
        // NNcreateTableControler.showCreateTableView();
        let param = {
            "config":{
                game : "niuniu",
                // type : "nn",
                expendIndex : 0,
                join : true,
                payway : 'owner',
                mode: 1,
                zhuangMode: 1,
                takeTurnMode: 1,
                optional: [
                    1,
                    2
                ],
                "defaultSelet":{
                }
            }
        }
        // param.config = CreateModel.getInstance().getConfig();
        // param.config.defaultSelet = CreateModel.getInstance().getDefaultSelect();
        cc.log('onClickBegin' +JSON.stringify(param));
        HallController.create(this.createSuccess.bind(this),param);
    }

    /**
     * 创建成功的回调
     */
    createSuccess(data) {
        cc.log('createSuccess ' + JSON.stringify(data));
        if(data.code == 200) {
            h.viewManager.removeView(this);

            // //这块把配制存起来
            // CreateModel.getInstance().setLocalInfo();
        }
    }

    backCallback(){
        HallController.showHallView();
    }

    joinCallback() {
        NNJoinTableController.showJoinTableView();
    }

    onPrefabLoaded() {
        NNcreateTableControler.getTableInfo(null);
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
        NNFightRecordController.showFightRecordView();
        //NNFightRecordController.showFightRecordView();
    }
}