/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-16 18:37:27 
 * @Desc: 路由
 */

export module HallNetHandler {
    export const gate = {
        gateHandler: {
            queryEntry: "gate.gateHandler.queryEntry", //网关路由
        }
    }
    export const connector = {
        entryHandler: {
            login: "connector.entryHandler.login", //登陆路由
        }
    }
    export const fgame = {
        gameHandler :{
            destroy: "fgame.gameHandler.destroy", // 游戏未开始前销毁房间
            dissolve: "fgame.gameHandler.dissolve", // 解散房间
            dissolveVote : "fgame.gameHandler.dissolveVote", // 解散房间投票
            create: "fgame.gameHandler.create", // 创建房间
            join: "fgame.gameHandler.join", // 加入房间
            leave:"fgame.gameHandler.leave", // 离开房间
            sitdown:"fgame.gameHandler.sitdown", // 房间内坐下
            standup:"fgame.gameHandler.standup", // 房间内站起
            ready:"fgame.gameHandler.ready", // 游戏玩家准备
            unready:"fgame.gameHandler.unready", // 游戏玩家取消准备
            cancelReady:'fgame.gameHandler.cancelReady',    //玩家取消准备
            ownerReady:"fgame.gameHandler.ownerReady", // 游戏房主准备 (限拼三张&牛牛等非固定人数游戏)
            chat:"fgame.gameHandler.chat", // 玩家系统文字&表情聊天
            chatText:"fgame.gameHandler.chatText", // 玩家自定义聊天
            chatHistory:"fgame.gameHandler.chatHistory", // 获取聊天记录
            kick:"fgame.gameHandler.kick", // 房主踢人
        }
    }
    export const push = {
        onRestoreGameInfo : "onRestoreGameInfo",        // 游戏断线重连
        onUpdateConfig: "onUpdateConfig",               // 更新配置
    }
}
