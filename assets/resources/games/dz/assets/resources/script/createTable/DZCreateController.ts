

//import { HallLoginView } from "./HallLoginView";
import { h } from "../../../../../../script/common/H";
import { CreateModel } from "./DZCreateModel";
import { BaseCreateView } from "./DZBaseCreateView";
import { DZ3Create } from "./DZ3Create";
import { DZSpeCreate } from "./DZSpeCreate";
import { DZConstant } from "../common/DZConstant";


export class CreateController {

    /**
     * 
     * 创建三个桌子
     * @static
     * @memberof CreateController
     */
    static showCreateView(type) {
        if (type == DZConstant.gameTypeState.ddz3people) {
            let view: DZ3Create = new DZ3Create(type);
            h.viewManager.pushView(view);
        } else {
            CreateModel.getInstance().setIndexs(0);
            let view: DZ3Create = new DZ3Create(type);
            h.viewManager.pushView(view);
        }
    }

    static getTableInfo(callback: Function) {
        //http://192.168.225.97/create.json
        //http://chessdev.369qipai.net/create/create.json
        
        cc.loader.loadRes("games/dz/assets/resources/res/config/create_new.json", function(err, data){
            h.log.debug("读取配置。。" + data);
            CreateModel.getInstance().setCreateData(data);
            if (callback) {
                callback();
            }
        });

        // h.http.getFile("http://chessdev.369qipai.net/create/create.json", function (data) {
        //     CreateModel.getInstance().setCreateData(JSON.parse(data));
        //     if (callback) {
        //         callback();
        //     }
        // });

    }
}
