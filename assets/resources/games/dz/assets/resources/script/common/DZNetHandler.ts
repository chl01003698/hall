/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 10:15:37 
 * @Desc: 斗地主路由
 */

export module DZNetHandler {
    export const fgame = {
        diZhuHandler: {
            showCards: "fgame.diZhuHandler.showCards", // 明牌 开始(第一次进入游戏场景)
            call: "fgame.diZhuHandler.call", // 叫地主
            kickPull: "fgame.diZhuHandler.kickPull", // 踢拉
            input: "fgame.diZhuHandler.input", // 打牌
            lookCards: "fgame.diZhuHandler.lookCards", //发牌中点明牌
            getResults:"fgame.diZhuHandler.getResults" // 游戏中战报
        }
    }

 
}
