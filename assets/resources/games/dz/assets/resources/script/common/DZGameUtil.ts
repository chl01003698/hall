import { DZConstant } from "./DZConstant";

/*
 * @Author: wang jun wei 
 * @Date: 2018-01-20 15:01:14 
 * @Last Modified by: wang jun wei
 * @Last Modified time: 2018-03-22 11:31:23
 */


export class DZGameUtil {
    //点出牌是否有牌打出
    static click_send_card: boolean = false;
    //出牌提示的按钮类型
   static buttonType:string = '';
   //发牌方式 两次发完2  逐张发完1   3次发完3
   static sendCards: number = 1;
   //是否可明牌
   static showCard: number = 1; //1：可明牌，2：不可明牌
   //缩放系数
   static UIBgScale: cc.Vec2 = new cc.Vec2(1, 1);
    //人数
   static playerNum:number = 0;
    //当前用户的服务器桌位号
   static serverSeatId: number = 0;
   static multiple: number = 1;

   //是否点了明牌*5
   static click_mingpai: boolean = false;
   //确定地主的时候，加倍不加倍是同时显示的，闹铃只显示自己的。
   static isDouble: boolean = false;
    //
   static playType: string = '';

   //让牌数,2人玩法有
   static letBrandNum: number = 0;

   //创桌规则里剩几张 1显示 2不显示
   static remaining: number = 1;

   //房间号
   static tableId: string = '';

   //房主id
   static ownerId: string = '';

   //游戏状态
   static game_status: string = '';

   //看了几张牌
   static lookCardNum: number = 0;
   //明牌倍数*5
   static mutilNum: number = 5;

   //地主的客户端id
   static landlordSeatId: number = -1;

   //癞子数组
   static laiziArray = [];

   //结算信息
   static resultInfo: string = "";

   //解散成功
   static dismiss_suc: boolean = false;
    
   private static MAP:any = {   // 服务器相对自己的位置到本地seat_id的映射
        "0":[],           // 处理还没有初始化的情况
        "2":[0, 1],       // 二人桌
        "3":[0, 1, 2],    // 三人桌
        "4":[0, 1, 3, 2]  // 四人桌
    };
    //播放声音 保存剩2张牌和1张牌 每个用户只播放一次声音
    static soundMap:any = {
        "0":[0,0,0],
        "1":[0,0,0],
        "2":[0,0,0],
        "3":[0,0,0]
    };

    static resetSoundMap(){
        DZGameUtil.soundMap = {
            "0":[0,0,0],
            "1":[0,0,0],
            "2":[0,0,0],
            "3":[0,0,0]
        };
    }

    //取本地存储数据
    static get (key) {
        return cc.sys.localStorage.getItem(key);
    }
    //把数据存储到本地
    static put (key, value) {
        cc.sys.localStorage.setItem(key, value);
    }
    //随机
    static random(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    }
    /**
     * 删除本地数据
     */
    static remove (key) {
        cc.sys.localStorage.removeItem(key);
    }
    /**
         * is 安卓
         */
        static  isAndroid () {
            if (cc.sys.isNative) {
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        /**
         * is iOS
         */
        static isIOS () {
            if (cc.sys.isNative) {
                if (cc.sys.os == cc.sys.OS_IOS) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        /**
         * 取SpriteFrame
         *
         * atlasPath : "images/atlas/gongyong"
         * frameName: pai
         *
         */
        static  getSpriteFrameByName (atlasPath, frameName) {
            let myPlist = cc.loader.getRes(atlasPath, cc.SpriteAtlas);
            //cc.qp.util.log("myPlist = " + myPlist);
            let myFrame = myPlist.getSpriteFrame(frameName);
            //cc.qp.util.log("myFrame = " + myFrame);
            return myFrame;
        }

        /**
         * 取plist
         *
         * atlasPath : "images/atlas/gongyong"
         */
        static getAtlasByName (atlasPath) {
            return cc.loader.getRes(atlasPath, cc.SpriteAtlas);
        }
        /**
         * 取已经加载到内存的预制体
         * prefabPath : "prefab/zhujian/open"
         */
        static getPrefabByName (prefabPath) {
            return cc.loader.getRes(prefabPath, cc.Prefab);
        }

        /**
         * 服务器返回的桌位号转成客户端的桌位号
         * serverSeatId 服务器返回的桌位号
         */
        static toLocalSeatId (serverSeatId) {
            cc.log('toLocalSeatId' + DZGameUtil.playerNum + "  " + DZGameUtil.serverSeatId)
            return DZGameUtil.MAP[DZGameUtil.playerNum][(serverSeatId - DZGameUtil.serverSeatId + DZGameUtil.playerNum) % DZGameUtil.playerNum];
        }
        //本地座位号转服务器桌位号
        static toServerSeatId(localSeatId){
            
            //return MAP[cc.qp.playerNum][((localSeatId - 0) + cc.qp.serverSeatId + cc.qp.playerNum)%cc.qp.playerNum];
            //return ((localSeatId - 0) + cc.qp.serverSeatId + cc.qp.playerNum)%cc.qp.playerNum;
            return ((DZGameUtil.MAP[DZGameUtil.playerNum][localSeatId] - 0) + DZGameUtil.serverSeatId + DZGameUtil.playerNum)%DZGameUtil.playerNum;
        
        }
        /**
         * 根据id获数组列表数据
         * */
        static getDataById (list,id) {
            for(let i = 0; i < list.length; i++){
                if(id == list[i].index){
                    return list[i]
                }
            }
            return null;
        }

         /**
         * 取时间小时和分
         */

        static getHourAndMinites () {
            var t = new Date();
            var hours = (t.getHours() > 9) ? t.getHours() : ("0" + t.getHours()); 
            var minutes = (t.getMinutes() > 9) ? t.getMinutes() : ("0" + t.getMinutes()); 
            　　 //var seconds = (t.getMilliseconds() > 9) ? t.getMilliseconds() : ("0" + t.getMilliseconds());
            var str = "" + hours + ":" + minutes; 
            return str;
        }

        /**
         * 排序牌大小
         */

        static sortPoker (array:any) {
            let self = this;
            var pokerNormal = [];
            var pokerLaizi = [];
            for(let i=0;i<array.length;i++) {
                if(array[i].length == 4) {
                    pokerLaizi.push(array[i]);
                }else {
                    pokerNormal.push(array[i]);
                }
            }
    
            pokerNormal.sort(function (a,b) {
                let pokerAIndex = DZConstant.pokerSort.indexOf(a);
                let pokerBIndex = DZConstant.pokerSort.indexOf(b);
                return pokerAIndex - pokerBIndex;
            })
    
            pokerLaizi.sort(function (a,b) {
                return - (a[3] - b[3]);
            })
    
            pokerNormal.unshift.apply(pokerNormal,pokerLaizi);
            return pokerNormal;
        }

}