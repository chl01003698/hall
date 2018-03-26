import { h } from "../../../../../../script/common/H";
import { HallBaseModel } from "../../../../../../script/common/HallBaseModel";
import { DZGameUtil } from "../../../../../dz/assets/resources/script/common/DZGameUtil";

/** 
 * 三张音效
*/

const {ccclass, property, menu} = cc._decorator;

@ccclass
//@menu("369/Button")
export default class SZPlaySound extends HallBaseModel {
    private static instance: SZPlaySound = null;
    private playerIpMap = new Map();
    static getInstance(): SZPlaySound {
        if (this.instance == null) {
            this.instance = new SZPlaySound();
        }
        return this.instance;
    }

    constructor(){
        super();
    }

    playBomb() {
        h.audioManager.playSoundByName('baozha');
    }

    playshunzi() {
        h.audioManager.playSoundByName('shunzi');
    }

    playBaozi() {
        h.audioManager.playSoundByName('baozi');
    }

    playDaxi() {
        h.audioManager.playSoundByName('daxi');
    }

    playHuopin() {
        h.audioManager.playSoundByName('huopin',true);
    }

    stopHuopin() {
        h.audioManager.stopSound('huopin');
    }


    playLaizi() {
        h.audioManager.playSoundByName('laizi');
    }

    playStart() {
        h.audioManager.playSoundByName('start');
    }

    playxiachouma() {
        h.audioManager.playSoundByName('xiachouma');
    }

    playzhunbei() {
        h.audioManager.playSoundByName('zhunbei');
    }

    playFlixPoker() {
        h.audioManager.playSoundByName('yingjia');
    }

    playshouChouma() {
        h.audioManager.playSoundByName('zongjiesuan');
    }


    playBibai(sex) {
        h.audioManager.playSoundByName('bipai' + DZGameUtil.random(1,4) + '_' + (sex == 1 ? 'M' : 'W'));
    }

    playGenzhu(sex) {
        h.audioManager.playSoundByName('genzhu' + DZGameUtil.random(1,4) + '_' + (sex == 1 ? 'M' : 'W'));
    }

    playHuopinMusic(sex) {
        h.audioManager.playSoundByName('huopin' + DZGameUtil.random(1,2) + '_' + (sex == 1 ? 'M' : 'W'));
    }

    playJiazhu(sex) {
        h.audioManager.playSoundByName('jiazhu' + DZGameUtil.random(1,3) + '_' + (sex == 1 ? 'M' : 'W'));
    }

    playKanpai(sex) {
        h.audioManager.playSoundByName('kanpai_' + (sex == 1 ? 'M' : 'W'));
    }

    playQipai(sex) {
        h.audioManager.playSoundByName('qipai' + DZGameUtil.random(1,3) + '_' + (sex == 1 ? 'M' : 'W'));
    }
}
