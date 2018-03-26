/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-27 22:21:38 
 * @Desc: 创建牌桌
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";
import { HallTableConfigView } from "./HallTableConfigView";

export class HallCreateTableView extends HallBaseView {
    private configView:cc.Node;

    constructor(){
        super();
        this.setBindDatas({
            changeBtn:{callback:this.closeCallback.bind(this)},
            CloseBtn:{callback:this.closeCallback.bind(this)},
            InfoList:{varName:"configView"}
        });
        this.setPrefab("res/prefab/createTable/createTable");
    }

    onPrefabLoaded(){
        let tableConfig = h.resManager.getRes("res/config/tableConfig");
        h.log.debug("hehe==", tableConfig);
        let view = new HallTableConfigView(tableConfig);
        this.configView.addChild(view);
        view.setContentSize(this.configView.getContentSize());
        this.fuck = view;
    }

    closeCallback(){
        h.log.debug(this.fuck);
        // h.viewManager.removeView(this);
    }
}
