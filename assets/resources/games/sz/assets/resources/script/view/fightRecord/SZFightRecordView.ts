/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 11:22:17 
 * @Desc: 战绩
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { SZFightRecordController } from "./SZFightRecordController";

 export class SZFightRecordView extends HallBaseView {

    constructor(){
        super();
        this.setBindDatas({
            guanbi:{callback:this.closeCallback.bind(this)},
        });
        this.setPrefab("res/prefab/zhanji/zhanji");
    }

    onPrefabLoaded(){
        SZFightRecordController.getRecords(function(){
            this.loadList();
        }.bind(this));
    }

    loadList(){
        
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
