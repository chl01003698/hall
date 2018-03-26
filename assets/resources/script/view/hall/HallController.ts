/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-17 13:50:41 
 * @Desc: 大厅
 */

import { HallView } from "./HallView";
import { h } from "../../common/H";
import { HallNetHandler } from "../../net/HallNetHandler";
import { HallViewConfig } from "../../config/HallViewConfig";
import { HallBaseView } from "../../common/HallBaseView";
import { HallNetConfig } from "../../net/HallNetConfig";
import { HallModel } from "./HallModel";
import {DZNetHandler} from "../../../games/dz/assets/resources/script/common/DZNetHandler";
import { HallUserModel } from "../login/HallUserModel";
import { HallConstant } from "./HallConstant";
import { DZHallController } from "../../../games/dz/assets/resources/script/view/hall/DZHallController";
import { HallBaseModel } from "../../common/HallBaseModel";
import { HallUtil } from "../../util/HallUtil";
import { HallFriendController } from "../friend/HallFriendController";

export class HallController {
    static curGameName:string = null;
    static hallName:string = "hall";

    static showHallView() {
        h.viewManager.popToRootView();
        HallViewConfig.setSearchPath("");
        let view: HallView = new HallView();
        view.setSign("hall");
        h.viewManager.pushView(view);
    }

    static closeHallView(){
        h.viewManager.removeViewBySign("hall");
    }

    static getCurGameName(){
        return this.curGameName;
    }

    static getHallName(){
        return this.hallName;
    }

    static startGame(gameName:string):HallBaseView{
        this.curGameName = gameName;
        switch(gameName){
            case "doudizhu":
                HallViewConfig.setSearchPath("games/dz/assets/resources/");
                break;
            case "sanzhang":
                HallViewConfig.setSearchPath("games/sz/assets/resources/");
                break;
            case "niuniu":
                HallViewConfig.setSearchPath("games/nn/assets/resources/");
                break;
        }
        let view:HallBaseView = new HallBaseView();
        view.setSign("gameStart");
        view.setPrefab("res/prefab/start");
        h.viewManager.pushView(view);
        return view;
    }

    static shareWebpage(webPageData){
        h.commonSDK.shareWebpage(webPageData.url, webPageData.title, webPageData.desc);
    }
    
    static inviteWxJoinGame(roomId:string){
        let data = HallUtil.deepCopy(HallNetConfig.webpage.inviteJoinGame);
        data.url += "&roomId=" + roomId;
        HallController.shareWebpage(data);
    }
    
    static inviteGiftCard(){
        let data = HallUtil.deepCopy(HallNetConfig.webpage.inviteGiftCard);
        data.url += "&shortId=" + HallUserModel.getInstance().getShortID();
        this.shareWebpage(data);
    }

    static checkMwurl(){
        let mwurl:string = h.commonSDK.getMwurl();
        h.log.debug("mwurl:", mwurl);
        let paramDict = HallUtil.getUrlParams(mwurl);
        if(!paramDict){
            return;
        }
        h.log.logObj(paramDict);
        switch(paramDict.tag){
            case HallNetConfig.shareTag.inviteFriend:
                HallFriendController.addFriend(null, paramDict.shortId);
            break;
            case HallNetConfig.shareTag.inviteJoinGame:
                HallController.join(null, paramDict.roomId);
            break;
        }
        h.commonSDK.cleanWmurl();
    }
    // service ////////////////////////////////////////////
    /**
     * 游戏未开始前销毁房间
     * @param callback 
     */
    static destroy(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.destroy, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 解散房间
     * @param callback 
     */
    static dissolve(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.dissolve, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 解散房间投票
     * @param callback 
     * @param vote 
     */
    static dissolveVote(callback:Function, vote:boolean ){
        let param:any = {
            vote:vote
        };
        h.net.sendData(HallNetHandler.fgame.gameHandler.dissolveVote, function(){
            if(callback){
                callback();
            }
        }, param);
    }

    /**
     * 创建房间
     * @param callback 
     * @param param 
     */
    static create(callback:Function, param:any ){
        h.net.sendData(HallNetHandler.fgame.gameHandler.create, function(data){
            if(callback){
                callback(data);
            }
        }, param);
    }

    /**
     * 加入房间
     * @param callback 
     * @param roomId 
     */
    static join(callback:Function, roomId:string){
        let param:any = {
            roomId:roomId,
        }
        h.net.sendData(HallNetHandler.fgame.gameHandler.join, function(data){
            if(callback){
                callback(data);
            }
        }, param);
    }

    /**
     * 离开房间
     * @param callback 
     */
    static leave(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.leave, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 房间内坐下 (限拼三张&牛牛等非固定人数游戏)
     * @param callback 
     */
    static sitdown(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.sitdown, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 游戏中战报
     * */
    static getResults(callback:Function){
        h.net.sendData(DZNetHandler.fgame.diZhuHandler.getResults, function(){
            if(callback){
                callback();
            }
        });
    }
    /**
     * 房间内站起 (限拼三张&牛牛等非固定人数游戏)
     * @param callback 
     */
    static standup(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.standup, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 游戏玩家准备
     * @param callback 
     */
    static cancelReady(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.cancelReady, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 游戏玩家准备
     * @param callback 
     */
    static ready(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.ready, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 游戏玩家取消准备
     * @param callback 
     */
    static unready(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.unready, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 游戏房主准备 (限拼三张&牛牛等非固定人数游戏)
     * @param callback 
     */
    static ownerReady(callback:Function){
        h.net.sendData(HallNetHandler.fgame.gameHandler.ownerReady, function(){
            if(callback){
                callback();
            }
        });
    }

    /**
     * 玩家系统文字&表情聊天
     * @param callback 
     */
    static chat(callback:Function, type:number, index:number,targetId:string = ''){
        let param:any = {
            type:type,
            index:index,
            targetId:targetId,
        }
        h.log.debug("routeSign:" +JSON.stringify(param));
        h.net.sendData(HallNetHandler.fgame.gameHandler.chat, function(){
            if(callback){
                callback();
            }
        }, param);
    }

    /**
     * 玩家自定义聊天
     * @param callback 
     * @param text 
     */
    static chatText(callback:Function, text:string){
        let param = {
            text:text
        }
        h.net.sendData(HallNetHandler.fgame.gameHandler.chatText, function(){
            if(callback){
                callback();
            }
        }, param);
    }

    /**
     * 获取聊天记录
     * @param callback 
     * @param uid 
     */
    static chatHistory(callback:Function, uid:string){
        let param:any = {
            uid:uid,
        }
        h.net.sendData(HallNetHandler.fgame.gameHandler.chatHistory, function(){
            if(callback){
                callback();
            }
        }, param);
    }

    /**
     * 房主踢人
     * @param callback 
     * @param uid 
     */
    static kick(callback:Function, uid:string){
        let param:any = {
            uid:uid,
        }

        h.net.sendData(HallNetHandler.fgame.gameHandler.kick, function(){
            if(callback){
                callback();
            }
        }, param);
    }

    static declaration(callback:Function, chessRoomId:string){
        h.http.get("/api/v1/curators/declaration/" + chessRoomId, function(data){
            HallModel.getInstance().setTips([data.data.declaration]);
            if(callback){
                callback();
            }
        });
    }

    static updateConfig(callback:Function){
        h.http.getFile(HallNetConfig.configUrl, function(data){
            HallModel.getInstance().setConfig(data);
            if(callback){
                callback();
            }
        });
    }

    static getCharge(callback:Function){
        let param = {
            "userId": HallUserModel.getInstance().getUserID(),
            "channel":    "wx",
            "platform":   "Android",        
            "amount":     1,
            "rmb":        15,
            "clientIp":  "127.0.0.1",
            "baseCoin":   15,
            "extraCoin":  15
        }
        h.http.post("/api/v1/orders", function(data){
            h.log.debug("paytest=", data);
            if(callback){
                callback(data);
            }
        }, param);
    }

    static shareaward(callback:Function){
        h.http.get("/api/v1/awards/shareaward/" + HallUserModel.getInstance().getUserID(), function(data){
            if(callback){
                callback(data);
            }
        })
    }
    

    /**
     * 监听房间断线重连
     * @param callback 
     */
    // static regOnRestoreGameInfo(callback:Function){
    //     h.net.regPush(HallNetHandler.push.onRestoreGameInfo, function(data){
    //         h.log.debug("%%%监听到断线重连...保存数据"+JSON.stringify(data));
    //         HallModel.getInstance().setRestoreGameInfo(data);
    //         HallController.startGame(data.roomConfig.game);
    //         if(callback){
    //             callback();
    //         }
    //     });
    // }

    /**
     * 更新配置的推送
     * @param callback
     */
    static regOnUpdateConfig(callback:Function){
        h.net.regPush(HallNetHandler.push.onUpdateConfig, function(data){
            this.updateConfig();
            if(callback){
                callback();
            }
        });
    }

}
