/*
 * @Desc: 三张路由
 */

export module SZNetHandler {
    export const fgame = {
        SzHandler: {
            giveup: "fgame.sanZhangHandler.giveup", // 弃牌
            checked: "fgame.sanZhangHandler.checked", // 看牌
            input: "fgame.sanZhangHandler.input", // 跟注,加注,比牌操作
            getbeatPlayers:"fgame.sanZhangHandler.getBeatPlayers",  //获取比牌玩家
            showCards:"fgame.sanZhangHandler.showCards",  //亮牌
            getResults:"fgame.sanZhangHandler.getResults", // 结算信息
            peiPai  :"fgame.sanZhangHandler.peiPai", // 结算信息
        }
    }

 
}
