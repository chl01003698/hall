import { HallStringUtil } from "../util/HallStringUtil";
import { HallConfig } from "../config/HallConfig";

/*
 * @Author: baizhanxiao
 * @Date: 2018-01-16 20:17:57
 * @Desc: 网络配置
 */

export module HallNetConfig {
    // export let host:string = "192.168.221.45";
    // export let port:string = "3010";
    // export let host: string = "192.168.225.95";
    export let host: string = "192.168.221.38";
    //export let host: string = "192.168.225.107";
    export let port: string = "3000";
    export let hallURL: string = HallStringUtil.format("http://{0}:7005", host);
    // if (!HallConfig.isDebug()) {
        host = "chessgate.369qipai.net";
        hallURL = "http://chesshall.369qipai.net:7005";
    // }

    export let baseURL: string = "http://192.168.223.113:4001";
    export let service: string = 'https://www.sobot.com/chat/h5/index.html';  // 客服
    export let ipUrl: string = 'http://pv.sohu.com/cityjson?ie=utf-8';    // 获取ip
    export let configUrl: string = "http://chessdev.369qipai.net/data/beta/config.json"; // 配置
    export let VerityCode: string = hallURL + "/api/v1/sms";  // 验证码
    export let BindPhone: string = hallURL + "/api/v1/users/phone";  // 绑定手机
    export let RealName: string = hallURL + "/api/v1/users/realName";  // 实名认证
    export let httpGetTimeout: number = 3000;
    export let httpPostTimeout: number = 5000;
    export let httpPutTimeout: number = 5000;
    export let httpDeleteTimeout: number = 5000;
    export let ddz_version = '1.0.4';
    export enum HTTP_CODE {
        NET_ERROR = -2,
        ERROR = -1,
        SUCCEED = 0,
    }
    export enum RESP_CODE{
        SUCCEED = 200,
    }
    export let netError = {
        code: HallNetConfig.HTTP_CODE.NET_ERROR,
        msg: "网络异常，服务访问失败"
    };
    let h5BaseUrl: string = hallURL;
    export let shareTag = {
        inviteFriend: "inviteFriend",
        inviteJoinGame: "inviteJoinGame",
        inviteGiftCard: "inviteGiftCard",
    }
    export let h5url = {
        guide: h5BaseUrl + "/public/index.html#/gameD_page", // 微信引导
        downGames: h5BaseUrl + "/public/index.html#/downGames", // 下载游戏
        event: h5BaseUrl + "/public/index.html#/event",      // 活动
        message: h5BaseUrl + "/public/index.html#/message", // 消息
        rules: h5BaseUrl + "/public/index.html#/rules",   // 规则
        agencyApplication: h5BaseUrl + "/public/index.html#/agencyApplication", // 代理申请
        redEnvelope: h5BaseUrl + "/public/index.html#/redEnvelope", // 发红包
        invitingFriends: h5BaseUrl + "/public/index.html#/invitingFriends", // 邀请好友
        gameRecord: h5BaseUrl + "/public/index.html#/gameRecord",        // 游戏记录
    }
}