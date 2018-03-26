/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-09 21:12:25 
 * @Desc: 热更
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";
import { HallHotUpdateEvent } from "../../manager/HallHotUpdateManager";
import { HallStringUtil } from "../../util/HallStringUtil";

 export class HallHotUpdateView extends HallBaseView {
    private progressLabel:cc.Node;

    constructor(){
        super();
        this.setBindDatas({
            progressLabel:{varName:"progressLabel"},
            pogressBar:{varName:"progressBar"},
        });
        this.setPrefab("res/prefab/hotupdate/hotupdate")
    }

    onPrefabLoaded(){
        h.eventManager.addListener(HallHotUpdateEvent.UPDATE_PROGRESSION, this.updateProgress, this);
    }

    updateProgress(data){
        let event = data.event;
        let completedCount = event.getDownloadedFiles();
        let totalCount = event.getTotalFiles();
        let progress:number = completedCount / totalCount;
        progress = parseFloat(progress.toFixed(2));
        this.progressBar.getComponent(cc.ProgressBar).progress = progress;
        this.progressLabel.getComponent(cc.Label).string = HallStringUtil.format("{0}/{1}", completedCount, totalCount);
    }

    close(){
        h.viewManager.removeView(this);
    }
}