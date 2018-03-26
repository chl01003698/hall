/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 01:12:36 
 * @Desc: 斗地主大厅
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { DZWebView } from "../common/DZWebView";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { SelfInfoController } from "../selfInfo/SelfInfoController";
import { TestPlayController } from "../testPlay/TestPlayController";
import { DZJingDongController } from "../jingDong/DZJingDongController";
import { CreateController } from "../../createTable/DZCreateController";
import { DZConstant } from "../../common/DZConstant";
import { DZJoinTableController } from "../join/DZJoinTableController";
import { DZZhanjiController } from "../zhanji/DZZhanjiController";
import { DZHallController } from "./DZHallController";
import { DZSetController } from "../set/DZSetController";
import { DZAlert } from "../common/DZAlert";
import { DZToast } from "../common/DZToast";
import { DZTestPlayModel } from "../testPlay/DZTestPlayModel";
import { DZXunshiController } from "../xunshi/DZXunshiController";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { HallViewConfig } from "../../../../../../../script/config/HallViewConfig";
import { DZVisitCardController } from "../visitCard/DZVisitCardController";
import { DZRedPacketController } from "../redPacket/DZRedPacketController";
import { DZShopController } from "../shop/DZShopController";
import { HallNetConfig } from "../../../../../../../script/net/HallNetConfig";
import { DZOnlineCustomerController } from "../onlineCustomer/DZOnlineCustomerController";
import { ReplayData } from "../../../../../../../script/manager/HallReplayData";
import { HallToast } from "../../../../../../../script/common/HallToast";
import { HallReplayManager } from "../../../../../../../script/manager/HallReplayManager";
import { HallAlert } from "../../../../../../../script/common/HallAlert";
import { HallSDKConstant } from "../../../../../../../script/sdk/HallSDKConstant";
import { HallFriendController } from "../../../../../../../script/view/friend/HallFriendController";

export class DZHallView extends HallBaseView {
    private pageView: cc.Node;
    private headSprite: cc.Node;
    private nameLabel: cc.Node;
    private cardCountLabel: cc.Node;
    private tableList: cc.Node;
    private tableListIsHide: boolean = true;
    private prefabName: string = null;
    constructor(prefabName: string = null) {
        super();
        this.setBindDatas({
            // 返回
            back: { callback: this.backCallback.bind(this) },
            // 试玩
            testBtn: { callback: this.testCallback.bind(this) },
            //个人资料
            kuang: { callback: this.userInfoCallback.bind(this) },
            // 购买桌卡
            add: { callback: this.addCallback.bind(this) },
            // 设置
            shezhi: { callback: this.setCallback.bind(this) },
            // 客服
            kefu: { callback: this.kefuCallback.bind(this) },
            // 活动
            huodong: { callback: this.hdCallback.bind(this) },
            // 消息
            xiaoxi: { callback: this.xxCallback.bind(this) },
            // 战绩
            zhanji: { callback: this.zjCallback.bind(this) },
            // 规则
            guize: { callback: this.gzCallback.bind(this) },
            // 商城
            iap: { callback: this.shopCallback.bind(this) },
            // 巡视
            xunshi: { callback: this.xsCallback.bind(this) },
            // 进货
            jhBtn: { callback: this.jhCallback.bind(this) },
            // 发红包
            fhbBtn: { callback: this.fhbCallback.bind(this) },
            // 后台管理
            houtai: { callback: this.htglCallback.bind(this) },
            // 牌桌列表
            pzlbBtn: { callback: this.tableListCallback.bind(this) },
            // 二人开桌
            liangren: { callback: this.erkzCallback.bind(this) },
            // 三人开桌
            sanren: { callback: this.srkzCallback.bind(this) },
            // 四人开桌
            siren: { callback: this.sirkzCallback.bind(this) },
            // 进桌
            jinzhuo: { callback: this.jzCallback.bind(this) },
            // 积分赛
            jifensai: { callback: this.jfsCallback.bind(this) },
            // 代理申请
            dlsqBtn: { callback: this.dlsqCallback.bind(this) },
            // 好友列表
            hylbBtn: { callback: this.hylbCallback.bind(this) },
            // 我要当馆长
            wydgzBtn: { callback: this.wydgzCallback.bind(this) },
            // 返回棋牌室
            fhqpsBtn: { callback: this.fhqpsCallback.bind(this) },
            // 推广名片
            tgmpBtn: { callback: this.tgmpCallback.bind(this) },
            // 客户列表
            khlbBtn: { callback: this.khlbCallback.bind(this) },
            // 游戏记录
            yxjlBtn: { callback: this.yxjlCallback.bind(this) },
            // 京东卡
            jingdongka: { callback: this.jdkCallback.bind(this) },
            //联系馆长
            lxgzBtn: { callback: this.lxgzCallback.bind(this) },
            // 牌桌列表
            scrollview: { varName: "tableList" },
            // pageView
            PageView: { varName: "pageView" },
            // 名字
            name: { varName: "nameLabel" },
            // 头像
            head: { varName: "headSprite" },
            // 桌卡数量
            cardCount: { varName: "cardCountLabel" },
            paizhuoliebiao: { varName: "tableListBg" },
            paizhuoliebiaoNode: { varName: "tableListNode" },
            wxBtn:{callback:this.shareCallback.bind(this)},
        });
        this.initPrefab(prefabName);
    }

    initPrefab(prefabName: string = null) {
        if (!prefabName) {
            prefabName = "hall";
            switch (HallUserModel.getInstance().getIdentityType()) {
                case HallConstant.IdentityType.common:
                    prefabName = "hall";
                    break;
                case HallConstant.IdentityType.correlation:
                    prefabName = "hall_guanyuan";
                    break;
                case HallConstant.IdentityType.curator:
                case HallConstant.IdentityType.proxy:
                    prefabName = "hall_guanzhang";
                    break;
            }
        }
        this.prefabName = prefabName;
        this.setPrefab("res/prefab/hall/" + prefabName);
    }


    onPrefabLoaded() {
        this.refreshUserInfo();
        this.refreshPageView();
        this.refreshTableList();
        h.audioManager.stopBGM();
        h.audioManager.playMGBByName('dating');
    }

    refreshTableList() {
        if (!this.tableList) {
            return;
        }
        var prefab = h.resManager.getPrefabByName("res/prefab/hall/paizuoliebiao_node");
        let cell = cc.instantiate(prefab);
        var cellSize = cell.getContentSize()
        var tableDatas = [1, 1, 1, 1, 1, 1, 1, 1];
        let cellBindDatas = {
            chakan: { varName: "lookTableBtn", callback: this.lookTableCallback.bind(this) },
            jinru: { varName: "enterTableBtn", callback: this.joinTableCallback.bind(this) }
        }
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return tableDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var cell = cc.instantiate(prefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    cell.lookTableBtn.tag = index;
                    cell.enterTableBtn.tag = index;
                    return cell;
            }
        }
        this.tableList.getComponent("MyList").setHandler(handler);
        this.tableList.getComponent("MyList").reloadData();
    }

    lookTableCallback(event) {
    }

    joinTableCallback(event) {

    }

    refreshPageView() {
        if (!this.pageView) {
            return;
        }
        TestPlayController.requestTestPlay(function () {
            let items: any[] = DZTestPlayModel.getInstance().FN_GetImageItems();
            for (let i in items) {
                let itemData = items[i];
                cc.loader.load(itemData.imgurl, function (error: Error, texture: cc.Texture2D) {
                    if (error) {
                        h.log.debug(error.message);
                        return;
                    }
                    let node: cc.Node = new cc.Node();
                    let sprite: cc.Sprite = node.addComponent(cc.Sprite);
                    let frame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = frame;
                    this.pageView.getComponent(cc.PageView).addPage(node);
                }.bind(this));
            }
        }.bind(this));
    }

    refreshUserInfo() {
        HallUIUtil.urlSprite(HallUserModel.getInstance().getHeadUrl(), this.headSprite);
        this.nameLabel.getComponent(cc.Label).string = HallUserModel.getInstance().getName();
        this.cardCountLabel.getComponent(cc.Label).string = HallUserModel.getInstance().getCardCount();
    }

    /**
     * 返回
     */
    backCallback() {
        if (this.prefabName != "hall") {
            h.viewManager.removeView(this);
            DZHallController.showDZHallView("hall");
        } else {
            HallController.showHallView();
        }
    }

    /**
     * 个人资料
     * */
    userInfoCallback() {
        SelfInfoController.showSelfInfoView();
    }

    /**
     * 购买桌卡
     */
    addCallback() {
        DZShopController.showShopView();
    }

    /**
     * 客服
     */
    kefuCallback() {
        DZHallController.showServiceGirl();
    }

    /**
     * 设置
     */
    setCallback() {
        DZSetController.showSetView();
    }

    /**
     * 二人开桌
     */
    erkzCallback() {
        CreateController.showCreateView(DZConstant.gameTypeState.ddz2people);
    }

    /**
     * 三人开桌
     */
    srkzCallback() {
        CreateController.showCreateView(DZConstant.gameTypeState.ddz3people);
    }

    /**
     * 四人开桌
     */
    sirkzCallback() {
        CreateController.showCreateView(DZConstant.gameTypeState.ddz4people);
    }

    /**
     * 进桌
     */
    jzCallback() {
        DZJoinTableController.showJoinTableView();
    }

    /**
     * 积分赛
     */
    jfsCallback() {
        HallToast.show("即将上线，敬请期待!!");
        //h.replayManager.startWithData(ReplayData);
    }

    /**
     * 牌桌列表
     */
    tableListCallback(event) {
        this.tableListIsHide = !this.tableListIsHide;
        let scale = HallViewConfig.getUIScale();
        this.tableListNode.runAction(cc.sequence(
            cc.moveBy(0.4, cc.p(this.tableListIsHide ? -this.tableListBg.width * scale : this.tableListBg.width * scale, 0)),
            cc.callFunc(
                function () {
                    var arrow: cc.Node = cc.find("youjiantou", event.target);
                    arrow.scaleX = -arrow.scaleX;
                    // self.rightArrow.runAction(cc.rotateBy(0.2, 180));
                }
            )
        ));
    }

    /**
     * 客户列表--群组
     */
    khlbCallback() {
        //DZOnlineCustomerController.showOnlineCustomerView();
        HallToast.show("即将开放,敬请期待");
    }

    /**
     * 推广名片
     */
    tgmpCallback() {
        DZVisitCardController.showVisitCardView();
    }

    /**
     * 好友列表
     */
    hylbCallback() {
        HallFriendController.showFriendView();
    }

    /**
     * 游戏记录
     */
    yxjlCallback() {
        DZWebView.show(HallNetConfig.h5url.gameRecord,DZConstant.webType.record);
    }

    /**
     * 进货
     */
    jhCallback() {
        DZShopController.showShopView();
    }

    /**
     * 发红包
     */
    fhbCallback() {
        DZRedPacketController.showRedPacketView();
    }

    /**
     * 巡视
     */
    xsCallback() {
        DZXunshiController.showXunshiView();
    }

    /**
     * 规则
     */
    gzCallback() {
        DZWebView.show(HallNetConfig.h5url.rules,DZConstant.webType.rule);
    }

    /**
     * 战绩
     */
    zjCallback() {
        // h.replayManager.startWithData(ReplayData);
        DZZhanjiController.showZhanjiView();
    }

    /**
     * 后台管理
     */
    htglCallback() {
        //地址不对，得换
        DZWebView.show(HallNetConfig.h5url.adminManager,DZConstant.webType.backStage);
    }

    /**
     * 活动
     */
    hdCallback() {
        DZWebView.show(HallNetConfig.h5url.event + "?token=" + HallUserModel.getInstance().getToken(), DZConstant.webType.active);
    }

    /**
     * 商城
     */
    shopCallback() {
        DZShopController.showShopView();
    }

    /**
     * 代理申请
     */
    dlsqCallback() {
        DZWebView.show(HallNetConfig.h5url.agencyApplication,DZConstant.webType.agent);
    }

    /**
     * 我要当馆长
     */
    wydgzCallback() {
        //地主不对，得换
        DZWebView.show(HallNetConfig.h5url.agencyApplication,DZConstant.webType.curator);
    }

    /**
     * 返回棋牌室
     */
    fhqpsCallback() {
        h.viewManager.removeView(this);
        DZHallController.showDZHallView();
    }

    /**
     * 联系馆长
     */
    //TODO：baizhanxiao
    lxgzCallback() {
        HallAlert.show("馆长电话：1380013800",this.ok);
    }

    ok(){
        
    }
    /**
     * 消息
     */
    xxCallback() {
        DZWebView.show(HallNetConfig.h5url.message + "?id=" + HallUserModel.getInstance().getUserID() + "&token=" + HallUserModel.getInstance().getToken(), DZConstant.webType.message);
    }

    /**
     * 试玩
     */
    testCallback() {
        TestPlayController.showTestPlayView()
    }

    /**
     * 京东卡
     */
    jdkCallback() {
        DZJingDongController.showJingDongView()
    }

    /**
     * 分享朋友圈
     */
    shareCallback(){
        let logoPath = jsb.fileUtils.fullPathForFilename(cc.url.raw("resources/" + h.resManager.getPath("res/images/atlas/369logo.jpg")));
        let data = jsb.fileUtils.getDataFromFile(logoPath);
        var fullPath = jsb.fileUtils.getWritablePath() + "share.jpg";
        jsb.fileUtils.writeDataToFile(data, fullPath);
        h.commonSDK.shareImage((fullPath), HallSDKConstant.SceneType.timeline, function(){
            HallController.shareaward(function(){

            });
        });
    }
}
