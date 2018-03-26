/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示h5界面
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import {DZConstant} from "../../common/DZConstant";

 export class DZWebView extends HallBaseView {
     private url:string;
     private webview:cc.Node;
     private m_type:any;
     private m_title:any;
    constructor(url:string,type:any){
        super();
        this.url = url;
        this.m_type = type;
        h.log.debug("url:", this.url);
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            webview:{varName:"webview"},
            titleName:{varName:"m_title"},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/common/webview");
    }

    static show(url:string,type:any){
        let view = new DZWebView(url,type);
        h.viewManager.pushView(view);
    }

    onPrefabLoaded(){
        let m_titleSprite = this.m_title.getComponent(cc.Sprite);
        HallUtil.schedule(function(){
            this.webview.getComponent(cc.WebView).url = this.url;
        }.bind(this), this, 0.2);

        let frameName:string ='';
        switch (this.m_type){
            case DZConstant.webType.rule:
                frameName = 'doudizhu_guize_icon1';
                break;
            case DZConstant.webType.backStage:
                frameName = 'doudizhu_guize_icon1';
                break;
            case DZConstant.webType.record:
                break;
            case DZConstant.webType.message:
                frameName = 'doudizhu_xiaoxi_icon0';
                break;
            case DZConstant.webType.active:
                frameName = 'doudizhu_huodong_icon1';
                break;
            case DZConstant.webType.agent:
                frameName = 'doudizhu_icon_dailizhuanqu';
                break;
            case DZConstant.webType.curator:
                break;
            case DZConstant.webType.statement:
                break;
            case DZConstant.webType.service:
                frameName = 'doudizhu_icon_kefu';
                break;

        }

        let info = h.resManager.getAtlasByName('res/images/atlas/zhuye');
        // let info = cc.loader.getRes("images/atlas/zhuye",cc.SpriteAtlas);
        m_titleSprite.spriteFrame =info.getSpriteFrame(frameName);
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
