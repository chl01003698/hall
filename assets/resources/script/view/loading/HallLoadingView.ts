/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 11:28:42 
 * @Desc: 加载界面
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";
import { HallViewConfig } from "../../config/HallViewConfig";
import { HallLoginController } from "../login/HallLoginController";
import { HallLoginView } from "../login/HallLoginView";

export class HallLoadingView extends HallBaseView {
    protected progressBar:cc.Node;
    constructor(){
        super();
        this.setBindDatas({
            pogressBar:{varName:"progressBar"},
        });
        this.setPrefab("res/prefab/loading/loading");
    }

    onPrefabLoaded(){
        cc.loader.loadResDir(HallViewConfig.getSearchPath() + "res", function(completedCount: number, totalCount: number, item: any){
            let progress:number = completedCount / totalCount;
            progress = parseFloat(progress.toFixed(2));
            this.progressBar.getComponent(cc.ProgressBar).progress = progress;
            console.log("res:", item.url);
        }.bind(this),function(error: Error, resource: any[], urls: string[]){
            if(error){
                h.log.debug(error.message);
            }
            let audioPathData = h.resManager.getRes("res/config/AudioPath");
            h.audioManager.loadAudio(audioPathData);
            this.onFinished();
        }.bind(this));
    }

    onFinished(){
        h.viewManager.popToRootView();
        HallLoginController.showLoginView();
    }
}
