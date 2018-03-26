/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-15 13:58:49 
 * @Desc: 所有view的基类
 */

import { HallUIUtil } from "../util/HallUIUtil";
import { h } from "./H";
import { HallViewConfig } from "../config/HallViewConfig";

export class HallBaseView extends cc.Node {
    protected sign: string = null;
    protected prefab: string = null;
    protected prefabNode: cc.Node = null;
    private bindDatas: any = null;
    private isShowMaskView: boolean = false;
    private isSwallowTouch: boolean = true;

    constructor() {
        super();
    }

    setSign(sign: string) {
        this.sign = sign;
    }

    getSign(): string {
        return this.sign;
    }

    getPrefabNode(): cc.Node {
        return this.prefabNode;
    }

    setBindDatas(bindDatas) {
        this.bindDatas = bindDatas;
    }

    addBindDatas(bindDatas) {
        if (this.bindDatas == null) {
            this.bindDatas = {};
        }
        for (var key in bindDatas) {
            this.bindDatas[key] = bindDatas[key];
        }
    }

    setSwallowTouch(isSwallow) {
        this.isSwallowTouch = isSwallow;
    }

    showMaskView(isShowMaskView: boolean) {
        this.isShowMaskView = isShowMaskView;
    }

    setPrefab(prefab: string) {
        this.prefab = prefab;
        this._loadPrefab()
    }

    _loadPrefab() {
        if (this.isSwallowTouch) {
            cc.loader.loadRes("res/prefab/common/zhezhao", cc.Prefab, function (error: Error, prefab: cc.Prefab) {
                if (error != null) {
                    h.log.debug(error.message);
                    return;
                }
                let maskPrefabNode: cc.Node = cc.instantiate(prefab);
                this.addChild(maskPrefabNode, -1);
                maskPrefabNode.setContentSize(cc.director.getVisibleSize());
                if (this.isShowMaskView) {
                    maskPrefabNode.getChildByName("maskBg").active = true;
                } else {
                    maskPrefabNode.getChildByName("maskBg").active = false;
                }

            }.bind(this));
        }
        if (this.prefab != null) {
            let prefab = h.resManager.getPrefabByName(this.prefab);
            if (prefab) {
                this.addPrefab(prefab);
                return;
            }
            cc.loader.loadRes(HallViewConfig.getSearchPath() + this.prefab, cc.Prefab, function (error: Error, prefab: cc.Prefab) {
                if (error != null) {
                    h.log.debug(error.message);
                    cc.loader.loadRes(this.prefab, cc.Prefab, function (error: Error, prefab: cc.Prefab) {
                        if (error != null) {
                            h.log.debug(error.message);
                            return;
                        }
                        this.addPrefab(prefab)
                    }.bind(this));
                    return;
                }
                this.addPrefab(prefab)
            }.bind(this));
        }
    }

    addPrefab(prefab: cc.Prefab) {
        this.prefabNode = cc.instantiate(prefab);
        this.addChild(this.prefabNode);
        HallUIUtil.adaptive(this.prefabNode);
        if (this.bindDatas) {
            HallUIUtil.bind(this.bindDatas, this.prefabNode, this);
        }
        this.onPrefabLoaded(prefab);
    }


    onPrefabLoaded(prefab: cc.Prefab) {

    }
}
