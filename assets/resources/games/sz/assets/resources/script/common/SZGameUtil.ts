
export class SZGameUtil {
    //人数
   static playerNum:number = 0;
    //当前用户的服务器桌位号
   static serverSeatId: number = 0;
   //房间号
   static tableId: string = '';

   //房主id
   static ownerId: string = '';

   //倒计时时间
   static readyTime: any = 0;


   //地主的客户端id
   static landlordSeatId: number = 0;
    
   private static MAP:any = {   // 服务器相对自己的位置到本地seat_id的映射
        "0":[],           // 处理还没有初始化的情况
        "2":[0, 1],       // 二人桌
        "3":[0, 1, 2],    // 三人桌
        "4":[0, 1, 2, 3],  // 四人桌
        "5":[0,1,2,3,4]
    };

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
     * 随机一个0到一个数之间的随机数
     * 
     * @static
     * @param {any} num 
     * @memberof SZGameUtil
     */
    static randomFromZero(num) {
        let random = Math.round(Math.random()*num);
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
            let myFrame = myPlist.getSpriteFrame(frameName);
            return myFrame;
        }

        /**
         * 取一个灰色的按钮
         */
        static getGraySpriteFrame() {
            let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
            return plist.getSpriteFrame('button_b3');
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
            cc.log('toLocalSeatId' + SZGameUtil.playerNum + "  " + SZGameUtil.serverSeatId)
            return SZGameUtil.MAP[SZGameUtil.playerNum][(serverSeatId - SZGameUtil.serverSeatId + SZGameUtil.playerNum) % SZGameUtil.playerNum];
        }
        //本地座位号转服务器桌位号
        static toServerSeatId(localSeatId){
            
            //return MAP[cc.qp.playerNum][((localSeatId - 0) + cc.qp.serverSeatId + cc.qp.playerNum)%cc.qp.playerNum];
            //return ((localSeatId - 0) + cc.qp.serverSeatId + cc.qp.playerNum)%cc.qp.playerNum;
            return ((SZGameUtil.MAP[SZGameUtil.playerNum][localSeatId] - 0) + SZGameUtil.serverSeatId + SZGameUtil.playerNum)%SZGameUtil.playerNum;
        
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
}