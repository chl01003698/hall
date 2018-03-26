/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-22 10:29:33 
 * @Desc: 设置
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";
import { HallAudioStatus } from "../../manager/HallAudioManager";
import { HallNetConfig } from "../../net/HallNetConfig";
import { DZWebView } from "../../../games/dz/assets/resources/script/view/common/DZWebView";

export class HallSetView extends HallBaseView{
    private soundBtn:cc.Node;
    private soundSlider:cc.Node;
    private musicBtn:cc.Node;
    private musicSlider:cc.Node;
 
    constructor(){
        super();
        this.setBindDatas({
           x:{callback:this.closeCallback.bind(this)},
           text_shengming:{callback:this.shengmingCallback.bind(this)},
            text_ver:{callback:this.proxyCallback.bind(this)},
           soundSlider:{varName:"soundSlider"},
           soundBtn:{varName:"soundBtn", callback:this.soundCallback.bind(this)},
           musicSlider:{varName:"musicSlider"},
           musicBtn:{varName:"musicBtn", callback:this.musicCallback.bind(this)},
           soundBg:{varName:"soundBg"},
           musicBg:{varName:"musicBg"},
           di:{varName:"sliderGrayBg"},
           text_ver_num:{varName:"text_ver_num"},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/set/shezhi");
    }
    onPrefabLoaded(){
        this.soundSlider.on('slide', this.soundSliderCallback.bind(this));
        this.musicSlider.on('slide', this.musicSliderCallback.bind(this));
        this.soundSlider.getComponent(cc.Slider).progress = h.audioManager.getSoundVolume();
        this.musicSlider.getComponent(cc.Slider).progress = h.audioManager.getMusicVolume();
        this.musicBtn.getComponent(cc.Toggle).isChecked = h.audioManager.getMusicStatus() == HallAudioStatus.close;
        this.soundBtn.getComponent(cc.Toggle).isChecked = h.audioManager.getSoundStatus() == HallAudioStatus.close;
        let sliderBgSise:cc.Size = this.sliderGrayBg.getContentSize();
        console.log(' size ===================== ' + sliderBgSise);
        let progress:number = h.audioManager.getSoundVolume();
        console.log(' progress ===================== ' + progress + " progress 2 " +   this.soundSlider.getComponent(cc.Slider).progress);
        this.soundBg.setContentSize(cc.size(sliderBgSise.width * progress, sliderBgSise.height));
        progress = h.audioManager.getMusicVolume();
        this.musicBg.setContentSize(cc.size(sliderBgSise.width * progress, sliderBgSise.height));
        this.text_ver_num.getComponent(cc.Label).string = "ver" + HallNetConfig.ddz_version;
    }



    closeCallback(){
        h.viewManager.removeView(this);
    }

    shengmingCallback(){
        HallWebView.show("http://m.baidu.com",DZConstant.webType.statement);
    }
    
    proxyCallback(){
        DZWebView.show(HallNetConfig.h5url.agencyApplication,DZConstant.webType.agent);
    }

    soundSliderCallback(){
        let sliderBgSise:cc.Size = this.sliderGrayBg.getContentSize();
        let progress:number = this.soundSlider.getComponent(cc.Slider).progress
        h.audioManager.setSoundVolume(progress);
        this.soundBg.setContentSize(cc.size(sliderBgSise.width * progress, sliderBgSise.height));
    }

    soundCallback(){
        h.audioManager.setSoundStatus(this.soundBtn.getComponent(cc.Toggle).isChecked);
    }

    musicSliderCallback(){
        let sliderBgSise:cc.Size = this.sliderGrayBg.getContentSize();
        let progress:number = this.musicSlider.getComponent(cc.Slider).progress
        h.audioManager.setMusicVolume(progress);
        this.musicBg.setContentSize(cc.size(sliderBgSise.width * progress, sliderBgSise.height));
    }

    musicCallback(){
        h.audioManager.setMusicStatus(this.musicBtn.getComponent(cc.Toggle).isChecked);
    }
}
