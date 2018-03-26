/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 15:40:54 
 * @Desc: 商店
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { h } from "../../../../../../../script/common/H";
import { HallCommonSDK } from "../../../../../../../script/sdk/HallCommonSDK";
import { HallController } from "../../../../../../../script/view/hall/HallController";


export class DZShopView extends HallBaseView {
    list: cc.Node = null ;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            list:{varName:"list"},
            buyBtn:{varName:"buyBtn", callback:this.buyCallback.bind(this)}
        });
        this.loadPrefab();
    }

    onPrefabLoaded(){
        this.loadList();
    }

    loadPrefab(){
        let identityType:HallConstant.IdentityType = HallUserModel.getInstance().getIdentityType();
        let prefabName:string = "res/prefab/shop/iap2";
        if(identityType == HallConstant.IdentityType.curator || identityType == HallConstant.IdentityType.proxy){
            prefabName = "res/prefab/shop/iap2";
        }
        this.showMaskView(true);
        this.setPrefab(prefabName);
    }

    loadList(){
        if(!this.list){
            return;
        }
        for(let i = 0; i < 6; ++i){
            let prefab = h.resManager.getPrefabByName("res/prefab/shop/iap");
            let prefabNode = cc.instantiate(prefab);
            this.list.addChild(prefabNode);
        }
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }

    buyCallback(){
        HallController.getCharge(function(data){
            let chargeStr = JSON.stringify(data.data);
            h.commonSDK.pay(chargeStr);
        });
    }
}
