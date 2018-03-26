/*
 * @Desc: 创建牌桌父类
 */

import { CreateController } from "./DZCreateController";
import { h } from "../../../../../../script/common/H";
import { BaseCreateView } from "./DZBaseCreateView";
import { CreateModel } from "./DZCreateModel";
import { DZConstant } from "../common/DZConstant";

export class DZSpeCreate extends BaseCreateView {
    private title: cc.Sprite;

    constructor(type) {
        super(type);
        super.showMaskView(true);
        this.addBindDatas({
            title: { varName: "title" },
        });
        this.type = type;
        this.setPrefab("res/prefab/createTable/open");
    }

    onPrefabLoaded() {
        super.onPrefabLoaded();
        this.isCommonSetting = true;
        this.updateView();
    }

    /**
     * 
     * 添加玩法条，子类实现
     */
    _addWanfaItem() {
        for (let i = 0; i < 7; i++) {
            var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/createTable/wanfaItemLeng', cc.Prefab)
            var node = cc.instantiate(prefab);
            var wanfaItem = node.getComponent('wanfaItem');
            this.wanfaItemArray.push(wanfaItem);
            wanfaItem.node.active = false;
            this.playTypeLayout.addChild(node);
        }
    }

    updateUI(data: any) {
        this.type = data.type;
        cc.log('xxxxxxx' + JSON.stringify(data));
        let zhuye = cc.loader.getRes('images/atlas/zhuye', cc.SpriteAtlas);
        switch (this.type) {
            case DZConstant.gameTypeState.ddz2people:
                this.title.spriteFrame = zhuye.getSpriteFrame('doudizhu_kaizhuo_errendoudizhu');
                break;
            case DZConstant.gameTypeState.ddz4people:
                this.title.spriteFrame = zhuye.getSpriteFrame('doudizhu_kaizhuo_sirendoudizhu');
                break;
        }
    }

}