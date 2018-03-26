/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示游戏中规则界面
 */
import {DZOnlineCustomerController} from "./DZOnlineCustomerController";

enum BtnType {
    online = 0,
    link = 1,
}
import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {DZOnlineCustomerModel} from "./DZOnlineCustomerModel";

 export class DZOnlineCustomerView extends HallBaseView {
     private m_kehu:any = null;
     private m_onlineDown:any = null;
     private m_onlineUp:any = null;
     private m_linkDown:any = null;
     private m_linkUp:any = null;
     private m_peopleNum:any;
     private m_peopleLabel:any;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            linkBtn:{callback:this.changeData.bind(this)},
            onlineBtn:{callback:this.changeData.bind(this)},
            onlineDown:{varName:'m_onlineDown'},
            onlineUp:{varName:'m_onlineUp'},
            linkDown:{varName:'m_linkDown'},
            linkUp:{varName:'m_linkUp'},
            peopleNum:{varName:'m_peopleNum'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/onlineCustomer/kehu");
    }

    onPrefabLoaded(){
        this.m_kehu = this.getPrefabNode().getComponent('DZQipaishikehu');
        this.m_peopleLabel = this.m_peopleNum.getComponent(cc.Label);
        var event ={
            target:{name:'onlineBtn'},
        }
        this.changeData(event);
    }

     changeData (event) {
         var showlist = null;
         switch (event.target.name) {
             case 'onlineBtn':
                 showlist = DZOnlineCustomerModel.getInstance().getInlineKeHu();
                 this.m_onlineDown.active = true;
                 this.m_onlineUp.active = false;
                 this.m_linkDown.active = false;
                 this.m_linkUp.active = true;
                 break;
             case 'linkBtn':
                 showlist = DZOnlineCustomerModel.getInstance().getLinkKeHu();
                 this.m_onlineDown.active = false;
                 this.m_onlineUp.active = true;
                 this.m_linkDown.active = true;
                 this.m_linkUp.active = false;
                 break;
         }
         this.m_peopleLabel.string = showlist.length + "/500";
         this.m_kehu.initKeHuList(showlist);
     }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
