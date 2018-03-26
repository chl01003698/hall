import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";



export default class SZbudgetView extends HallBaseView {
    playerLayout: any;
    data: any;
   
    constructor(data) {
        super();
        this.data = data;
        this.setBindDatas({
            "ready": { varName: "ready", callback: this.readyClick.bind(this) },
            "share": { varName: "share", callback: this.shareClick.bind(this) },
            "playerLayout": { varName: "playerLayout"},
            "jushu": { varName: "jushu"},
        });
        this.setPrefab("res/prefab/budget/budget");
    }

    onPrefabLoaded() {
       this.addPlayers();
    }
    //关闭界面
    closeCreateView() {
        h.viewManager.removeView(this);
    }

    //准备点击
    readyClick() {
        h.viewManager.removeView(this);
        HallController.ready(this.clickReadyBtn.bind(this));
    }

    clickReadyBtn() {
    }

    //分享点击
    shareClick() {

    }
    /**
     * 添加玩家
     * 
     * @memberof SZbudgetView
     */
    addPlayers() {
        this.data.results.sort(function(a,b) {
            return a.sid - b.sid;
        })
        cc.log('addPlayers' + JSON.stringify(this.data));
        for(let i=0;i<this.data.results.length;i++) {
            let prefab = cc.loader.getRes("games/sz/assets/resources/res/prefab/budget/budgetItem",cc.Prefab);
            let budgetItem = cc.instantiate(prefab).getComponent('SZbudgetItem')
            this.playerLayout.addChild(budgetItem.node);
            budgetItem.updateView(this.data.results[i]);
        }
    }
}
