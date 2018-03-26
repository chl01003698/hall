/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-17 13:47:10 
 * @Desc: 大厅界面
 */

import { HallBaseView } from "../../common/HallBaseView";
import { HallController } from "./HallController";

export class HallView extends HallBaseView {
    private nameLabel:cc.Node;
    private cardCountLabel:cc.Node;

    constructor() {
        super();
        this.setBindDatas({
            "ddzBtn": { varName: "ddzBtn", callback: this.gameCallback.bind(this) },
            "szBtn":{varName:"szBtn", callback:this.gameCallback.bind(this)},
            "nnBtn": { varName: "nnBtn", callback: this.gameCallback.bind(this) },
            name:{varName:"nameLabel"},
            cardCount:{varName:"cardCountLabel"}
        });
        this.setPrefab("res/prefab/hall/hall");
    }

    onPrefabLoaded() {
    }

    gameCallback(event) {
        switch(event.target.getName()){
            case "ddzBtn":
            HallController.startGame("doudizhu");
            break;
            case "szBtn":
            HallController.startGame("sanzhang");
            break;
            case "nnBtn":
            HallController.startGame("niuniu");
            break;
        }
    }
}