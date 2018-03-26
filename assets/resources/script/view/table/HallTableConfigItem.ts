/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-27 11:58:12 
 * @Desc: 开桌面板按钮
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";

 export class HallTableConfigItem extends HallBaseView {
    private radioBtn:cc.Node;
    private checkBtn:cc.Node;
    private itemTitleLabel:cc.Node;
    private titleLabel:cc.Node;
    private data:any;
    private curBtn:cc.Node;
    private callback:Function;

    constructor(data:any){
        super();
        this.data = data;
        this.setBindDatas({
            Circle:{varName:"radioBtn"},
            Square:{varName:"checkBtn"},
            text:{varName:"itemTitleLabel"},
            title:{varName:"titleLabel"},
            nodeBtn:{callback:this.clickCallback.bind(this)}
        });
        this.setSwallowTouch(false);
        this.setPrefab("res/prefab/createTable/btnItemnew");
    }

    onPrefabLoaded(){
        this.setContentSize(this.getPrefabNode().getContentSize());
        h.log.debug("haha123");
        this.refresh();
    }

    setCallback(callback){
        this.callback = callback;
    }

    clickCallback(event){
        if(this.callback){
            this.callback(event, this.data);
        }
    }

    refresh(){
        this.radioBtn.active = false;
        this.checkBtn.active = false;
        this.itemTitleLabel.active = false;
        this.titleLabel.active = false;
        let titleLabel;
        switch(this.data.data.type){
            case "radio":
                this.curBtn = this.radioBtn;
                this.radioBtn.active = true;
                titleLabel = this.itemTitleLabel;
                break;
            case "check":
                this.curBtn = this.checkBtn;
                this.checkBtn.active = true;
                titleLabel = this.itemTitleLabel;
                break;
            case "group":
                titleLabel = this.titleLabel;
                break;
        }
        titleLabel.active = true;
        titleLabel.getComponent(cc.Label).string = this.data.data.title || this.data.optionData.title;
        this.refreshSelected();
    }

    setEnabled(enabled){
        this.data.optionData.enabled = enabled;
        this.refreshEnabled();
    }

    isEnabled():boolean{
        let enabled = this.data.optionData.enabled;
        if(enabled == null){
            enabled = true;
        }
        return enabled;
    }

    refreshEnabled(){
        if(!this.curBtn){
            return;
        }
        let enabled = this.isEnabled();
        if(enabled){
            this.itemTitleLabel.color = cc.color(255, 255, 255);
        }else{
            this.itemTitleLabel.color = cc.color(166, 166, 166);
            this.setSelected(false);
        }
    }

    refreshSelected(){
        if(!this.curBtn){
            return;
        }
        let selectedTag = this.curBtn.getChildByName("checkmark");
        selectedTag.active = this.data.optionData.selected;
    }

    setSelected(isSelected){
        this.data.optionData.selected = isSelected;
        this.refreshSelected();
    }

    changeSelected(){
        this.setSelected(!this.isSelected());
    }

    isSelected(){
        return this.data.optionData.selected;
    }

    
 }
