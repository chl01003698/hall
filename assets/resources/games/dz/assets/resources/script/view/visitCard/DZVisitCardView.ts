/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 11:03:17 
 * @Desc: 名片分享
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallCommonSDK } from "../../../../../../../script/sdk/HallCommonSDK";
import { DZToast } from "../common/DZToast";
import { HallViewConfig } from "../../../../../../../script/config/HallViewConfig";


 export class DZVisitCardView extends HallBaseView {

    private visitCard:cc.Node;

    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            fenxiang:{callback:this.shareCallback.bind(this)},
            xiazia:{callback:this.downloadCallback.bind(this)},
            card:{varName:"visitCard"},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/visitCard/visit_card");
    }

    onPrefabLoaded(){
        this.loadVisitCard();
    }

    loadVisitCard(){
        // let url = 'http://www.369qipai.cn/Public/Home/images/gongzhonghao_erweima.png';
        // cc.loader.load(url, function (err, texture) {
        //     if(texture){
        //          var frame = new cc.SpriteFrame(texture);
        //          this.visitCard.getComponent(cc.Sprite).spriteFrame = frame;
        //      }
        // }.bind(this));
        cc.loader.loadRes("res/images/test.png", function(err, texture){
            if(err){
                h.log.debug(err.message);
                return;
            }
            if(texture){
                var frame = new cc.SpriteFrame(texture);
                this.visitCard.getComponent(cc.Sprite).spriteFrame = frame;
            };
        }.bind(this));
    }

    shareCallback(){
        h.log.debug("分享");
        var filename = "result_share.png"
        var size = this.visitCard.getContentSize();
        var uiScale = HallViewConfig.getUIScale();
        size.width = Math.floor(size.width * uiScale);
        size.height = Math.floor(size.height * uiScale);
        var winSize = cc.director.getVisibleSize();
        var pos = this.visitCard.convertToWorldSpace(cc.v2(0, 0));
        h.commonSDK.screenshot(this.visitCard, filename, function(fullPath){

            h.commonSDK.cutImage(fullPath, fullPath, pos.x, winSize.height - size.height - pos.y, size.width, size.height);
            h.commonSDK.shareImage(fullPath);
        })
    }

    downloadCallback(){
        h.log.debug("保存到相册");
        var size = this.visitCard.getContentSize();
        var uiScale = HallViewConfig.getUIScale();
        size.width = Math.floor(size.width * uiScale);
        size.height = Math.floor(size.height * uiScale);
        var winSize = cc.director.getVisibleSize();
        var pos = this.visitCard.convertToWorldSpace(cc.v2(0, 0));
        h.commonSDK.screenshot(this.visitCard, null, function(fullPath){
            h.commonSDK.cutImage(fullPath, fullPath, pos.x, winSize.height - pos.y - size.height, size.width, size.height);
            h.commonSDK.saveToAlbum(fullPath);
            DZToast.show("成功保存到相册");
        })
    }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
