/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示h5界面
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallUtil } from "../../../../../../../script/util/HallUtil";

 export class DZWebView extends HallBaseView {
     private url:string;
     private webview:cc.Node;
    constructor(url:string){
        super();
        this.url = url;
        h.log.debug("url:", this.url);
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            webview:{varName:"webview"},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/common/webview");
    }

    static show(url:string){
        let view = new DZWebView(url);
        h.viewManager.pushView(view);
    }

    onPrefabLoaded(){
        HallUtil.schedule(function(){
            this.webview.getComponent(cc.WebView).url = this.url;
        }.bind(this), this, 0.2);
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
