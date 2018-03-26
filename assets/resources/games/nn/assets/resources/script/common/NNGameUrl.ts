import { HallStringUtil } from "../../../../../../script/util/HallStringUtil";

/*
 * @Author: wang jun wei 
 * @Date: 2018-01-20 14:32:13 
 * @Last Modified by: wang jun wei
 * @Last Modified time: 2018-01-20 16:25:43
 */


export class DZGameUrl {
    // 活动
    private static activity: string = 'http://192.168.223.113:8080/#/event';
    // 消息
    private static message: string = 'http://192.168.223.113:8080/#/message';
    // 客服
    private static service: string = 'https://www.sobot.com/chat/h5/index.html?sysNum=85062fe155bf4d6b934251e785ccb87e&partnerId=%s&uname=%s';
    // 馆长申请
    private static applyForCurator: string = 'http://preagent.369qipai.cn/Agent.php/Agent/Apply/index?userID=%s';
    // H5支付
    private static pay: string = 'http://preagent.369qipai.cn/index.php/Agent/Billing/index?merchant_id=%s&product_id=%s&consigneeID=%s&userID=%s&preOrderID=%s&exParam=%s&product_num=%s&product_name=%s&sign=%s&game_id=%s';
    // 游戏下载
    private static gameDownload: string = 'http://192.168.223.113:8080/#/downGames';

    private static shareFriends: string = 'http://preagent.369qipai.cn/Agent.php/Agent/Invite/index?invitecode=0&AgentID=1&game_id=2';
    //发红包
    private static redPackge: string = 'http://192.168.223.113:8080/#/redEnvelope';
    //邀请京东卡
    private static jingdong: string = 'http://192.168.223.113:8080/#/invitingFriends';
    //游戏记录
    private static gameRecord: string = 'http://192.168.223.113:8080#/gameRecord';
    //后台管理
    private static backManager: string = 'http://192.168.223.113:8080/houtai/Login.html';
    //已邀好友列表
    // private static inviteFriend: string = "http://192.168.224.153:4001/api/v1/users/friends/invited";
    private static inviteFriend: string = "http://192.168.225.95:7001/api/v1/users/friends/invited";//洪亮
    //领取邀请好友京东卡
    private static updateGiveInvite: string = "http://192.168.224.153:4001/inviteusers/";
    //邀请好友总数和领取桌卡总数接口
    private static inviteTotal: string = 'http://192.168.224.153:4001/invitedatas/';
    //在线好友
    private static onlineFriend: string = 'http://192.168.225.95:7001/api/v1/users/friends/online/';
    //试玩群
    // private static TestPlay: string = 'http://192.168.224.153:4001/api/v1/banners/0';
    private static TestPlay: string = 'http://192.168.225.95:7001/public/data/banner.json'
    //获取验证码
    private static VerityCode:string = 'http://192.168.225.95:7001/api/v1/sms';
    //绑定手机
    private static BindPhone:string  =  'http://192.168.225.95:7001/api/v1/users/phone';
    //实名认证
    private  static  RealName:string = 'http://192.168.225.95:7001/api/v1/users/realName';




    //	获取活动url
    static getActivity() :string{
        return DZGameUrl.activity;
    }

    // 获取消息url
    static  getMessage() :string{
        return DZGameUrl.message;
    }

    // 获取客服url
    static getService(_partnerId, _uname) :string{
        var partnerId = String(_partnerId) || '0';
        var uname = String(_uname) || '1';
        var urlStr = HallStringUtil.format(DZGameUrl.service, partnerId, uname);

        return urlStr;
    }

    // 获取h5支付url
    static getPay(
        _merchant_id, _product_id, _consigneeID,
        _userID, _preOrderID, _exParam, _product_num,
        _product_name, _sign, _game_id) :string
        {
        var merchant_id = String(_merchant_id) || '0';
        var product_id = String(_product_id) || '1';
        var consigneeID = _consigneeID || '2';
        var userID = String(_userID) || '3';
        var preOrderID = String(_preOrderID) || '4';
        var exParam = String(_exParam) || '5';
        var product_num = String(_product_num) || '6';
        var product_name = String(_product_name) || '7';
        var sign = String(_sign) || '8';
        var game_id = String(_game_id) || '9';
        var urlStr = HallStringUtil.format(DZGameUrl.pay,
            merchant_id, product_id, consigneeID,
            userID, preOrderID, exParam, product_num,
            product_name, sign, game_id);

        return urlStr;
    }

    // 获取申请馆长url
    static  getApplyForCurator(_userID) {
        var userID = String(_userID) || '0';
        cc.log('userId', userID);
        var urlStr = HallStringUtil.format(DZGameUrl.applyForCurator, userID);
        cc.log('url: ', urlStr);
        return urlStr;
    }

    // 获取游戏下载url
    static getGameDownload() {
        return DZGameUrl.gameDownload;
    }
    // 获取游戏下载url
    static  getShareFriends() {
        return DZGameUrl.shareFriends;
    }

    //获得发红包url
    static  getRedPackge() {
        return DZGameUrl.redPackge;
    }
    //获得邀请京东url
    static  getJingDong() {
        return DZGameUrl.jingdong;
    }
    //获得游戏记录
    static   getGameRecord() {
        return DZGameUrl.gameRecord;

    }
    //获得后台管理
    static getBackManager() {
        return DZGameUrl.backManager;
    }

    //获得已邀好友列表
    static getInviteFriend() {
        return DZGameUrl.inviteFriend;
    }
    //获得领取邀请好友京东卡
    static getUpdateGiveInvite() {
        return DZGameUrl.updateGiveInvite;
    }
    //获得邀请好友总数和领取桌卡总数接口
    static getInviteTotal() {
        return DZGameUrl.inviteTotal;
    }
    //获得在线好友
    static getOnlineFriend() {
        return DZGameUrl.onlineFriend;
    }
    //获得试玩群
    static getTestPlay() {
        return DZGameUrl.TestPlay;
    }
    //获得验证码
    static  getVerityCode(){
        return DZGameUrl.VerityCode;
    }
    //获取绑定手机
    static  getBindPhone(){
        return DZGameUrl.BindPhone;
    }
    //实名认证
    static  getRealName(){
        return DZGameUrl.RealName;
    }


    static shareWebpage(type: DZConstant.shareWeb) {
        switch (type) {
            case DZConstant.shareWeb.ReciveFriend:
                //CommonSDK.shareWebpage(cc.qp.url.h5.getShareFriends(), "【好友来呦,一起娱乐】", "点击链接,接受邀请,下载游戏新用户注册还有额外“礼包“", SDKConstant.SceneType.session);
                break;
            case DZConstant.shareWeb.SendRedPackge:
                //CommonSDK.shareWebpage(cc.qp.url.h5.getRedPackge(), "【红包来袭，速来约局】", "点击链接就可领取馆长送出的桌卡", SDKConstant.SceneType.session);
                break;
            case DZConstant.shareWeb.GiveJingDong:
                //CommonSDK.shareWebpage(cc.qp.url.h5.getJingDong(), "【分享好友送京东卡】", "点击链接,分享給好友送京东卡", SDKConstant.SceneType.session);
                break;
        }
    }

}