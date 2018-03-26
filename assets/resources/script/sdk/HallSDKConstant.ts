/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-16 14:21:55 
 * @Desc: SDK常量
 */
export module HallSDKConstant {
    export enum SceneType {
        session = 0,		// 好友
        timeline = 1,		// 朋友圈
        favorite = 2,		// 收藏
    }

    export enum ShareType {
        image = 1,			// 图片
        webpage = 2, 		// 网页
    }

    export enum RespType {
        login = 1,
        share = 2,
    }

    export enum ErrCode {
        ERR_OK = 0,				// 成功
        ERR_COMM = -1,			// 一般错误
        ERR_USER_CANCEL = -2,	// 用户取消
        ERR_SENT_FAILED = -3, 	// 失败
        ERR_AUTH_DENIED = -4,	// 用户拒绝
        ERR_UNSUPPORT = -5,     // 不支持
        ERR_BAN = -6, 			// 签名不一致
    }

    export enum LoginType {
        wx = "wechat"           // 微信登录
    }
}