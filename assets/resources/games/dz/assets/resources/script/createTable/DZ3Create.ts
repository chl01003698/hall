/*
 * @Desc: 创建牌桌父类
 */

import { CreateController } from "./DZCreateController";
import { h } from "../../../../../../script/common/H";
import { BaseCreateView } from "./DZBaseCreateView";
import { CreateModel } from "./DZCreateModel";
import { DZGameRuleController } from "../view/gameRule/DZGameRuleController";
import { DZShopController } from "../view/shop/DZShopController";
import { HallUserModel } from "../../../../../../script/view/login/HallUserModel";

export class DZ3Create extends BaseCreateView {
    index: number;
    private BtnTouchDefaultArray: any[];
    private BtnTouchEndArray: any[];
    private btnLayout: cc.Node;
    private wanfaBtn: cc.Node;
    private shop: cc.Node;
    private tableCardLabel: cc.Node;

    constructor(type) {
        super(type);
        super.showMaskView(true);
        this.addBindDatas({
            btnLayout: { varName: "btnLayout" },
            'text/wanfa': { varName: 'wanfaBtn', callback: this.onWanfa.bind(this) },
            'zhuoka/add': { varName: 'shop', callback: () => DZShopController.showShopView() },
            'zhuoka/roomCard': { varName: 'tableCardLabel' },
        });
        this.type = type;
        this.setPrefab("res/prefab/createTable/open3");
    }

    onPrefabLoaded() {
        super.onPrefabLoaded();
        this.isCommonSetting = true;
        this.BtnTouchEndArray = [];
        this.BtnTouchDefaultArray = [];

        this.updateView();

        this.tableCardLabel.getComponent(cc.Label).string = String(HallUserModel.getInstance().getCardCount());
    }

    updateView() {
        super.updateView();
        //刷新玩法按钮
        this.index = CreateModel.getInstance().getIndex();
        this._updateButtons();
    }

    _addWanfaItem() {
        for (let i = 0; i < 8; i++) {
            var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/createTable/wanfaItem', cc.Prefab)
            var node = cc.instantiate(prefab);
            var wanfaItem = node.getComponent('wanfaItem');
            this.wanfaItemArray.push(wanfaItem);
            wanfaItem.node.active = false;
            this.playTypeLayout.addChild(node);
        }
    }

    _updateButtons() {
        var index = 0;

        let playMethod = CreateModel.getInstance().getAllPlayType(this.type);
        var self = this;
        for (var i = 0; i < playMethod.length; i++) {
            let prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/createTable/wanfaBtn', cc.Prefab);
            var node = cc.instantiate(prefab);
            self.btnLayout.addChild(node);

            var btn = node.getChildByName('Button');
            btn.index = index;
            let selfs = self;
            btn.on('touchend', function () {
                if (this.index != selfs.createInfo.index) {
                    self.typeBtnClick(this.index);
                }
            });

            var hotNode = node.getChildByName('hot');

            var touchendNode = node.getChildByName('xuanzhong');
            touchendNode.getChildByName('text').getComponent(cc.Label).string = playMethod[index];

            self.BtnTouchEndArray.push(touchendNode);

            var touchDefaultNode = node.getChildByName('weixuanzhong');
            touchDefaultNode.getComponent(cc.Label).string = playMethod[index];
            self.BtnTouchDefaultArray.push(touchDefaultNode);
            if (this.index == index) {
                touchendNode.active = true;
                touchDefaultNode.active = false;
            } else {
                touchendNode.active = false;
                touchDefaultNode.active = true;
            }
            index++;
        }
    }

    _updateBtnStates() {
        for (var i = 0; i < this.BtnTouchEndArray.length; i++) {
            if (i == this.index) {
                this.BtnTouchEndArray[i].active = true;
                this.BtnTouchDefaultArray[i].active = false;
            } else {
                this.BtnTouchEndArray[i].active = false;
                this.BtnTouchDefaultArray[i].active = true;
            }
        }

    }

    typeBtnClick(index: number) {
        cc.log('createTable' + index);
        CreateModel.getInstance().setIndex(index);
        this.index = index;
        var createInfo = CreateModel.getInstance().getCreateInfoArray(this.type);
        this.changeView(createInfo);
    }

    changeView(param) {
        super.changeView(param);
        this._updateBtnStates();
    }

    onWanfa() {
        DZGameRuleController.showGameRuleView(this.createInfo.type);
    }
}