/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-06 14:42:20 
 * @Desc: log显示
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";

 export class HallLogView extends HallBaseView {
    private text:string;
    private logLabel:cc.Node;

    static show(text:string){
        let view = new HallLogView(text);
        h.viewManager.pushView(view);
    }
    constructor(text:string){
        super();
        this.text = text;
        this.setBindDatas({
            logLabel:{varName:"logLabel"},
            closeBtn:{callback:this.closeCallback.bind(this)},
        });
        this.setPrefab("res/prefab/test/log.prefab");
    }
    
    onPrefabLoaded(){
        this.logLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        this.logLabel.width = this.logLabel.parent.getContentSize().width - 20;
        this.logLabel.getComponent(cc.Label).string = this.text;
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
