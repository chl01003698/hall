/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 21:48:22 
 * @Desc: 资源管理器
 */

import { HallViewConfig } from "../config/HallViewConfig";
import { h } from "../common/H";


export class HallResManager {

    getPrefabByName(path, isHall:boolean = false): cc.Prefab {
        let prefab = this.getRes(path, cc.Prefab, isHall);
        return prefab;
    }


    getSpriteFrameByName(path, frameName, isHall:boolean = false): cc.SpriteFrame {
        let myPlist = this.getRes(path, cc.SpriteAtlas, isHall);
        let myFrame = myPlist.getSpriteFrame(frameName);
        return myFrame;
    }

    /**
 * 取plist
 *
 * atlasPath : "images/atlas/gongyong"
 */
    getAtlasByName(path, isHall:boolean = false) {
        return this.getRes(path, cc.SpriteAtlas, isHall);
    }

    getRes(path, type:Function = null, isHall:boolean = false){
        let gamePath = this.getPath(path, isHall);
        let res = cc.loader.getRes(gamePath, type);
        if(!res){
            let hallPath = this.getPath(path, true);
            res = cc.loader.getRes(hallPath, type);
        }
        return res;
    }

    getPath(path, isHall:boolean = false){
        if(!isHall){
            path = HallViewConfig.getSearchPath() + path;
        }
        return path;
    }
}
