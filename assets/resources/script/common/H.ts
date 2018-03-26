/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-15 20:41:20 
 * @Desc: 大厅
 */

import { HallEventManager } from "../manager/HallEventManager";
import { HallViewManager } from "../manager/HallViewManager";
import { HallNet } from "../net/HallNet";
import { HallHTTP } from "../net/HallHTTP";
import { HallNetConfig } from "../net/HallNetConfig";
import { HallLog } from "../util/HallLog";
import { HallResManager } from "../manager/HallResManager";
import { HallAudioManager } from "../manager/HallAudioManager";
import { HallStorage } from "./HallStorage";
import { HallCommonSDK } from "../sdk/HallCommonSDK";
import { HallVoiceManager } from "../manager/HallVoiceManager";
import { HallReplayManager } from "../manager/HallReplayManager";
import { HallUtil } from "../util/HallUtil";
import { HallHotUpdateManager } from "../manager/HallHotUpdateManager";

export namespace h {
    export let eventManager:HallEventManager = new HallEventManager();
    export let viewManager:HallViewManager = new HallViewManager();
    export let resManager:HallResManager = new HallResManager();
    export let net:HallNet = HallNet.getInstance();
    export let pomelo:any = require("pomelo-client");
    export let http:HallHTTP = new HallHTTP(HallNetConfig.hallURL);
    export let log:HallLog = new HallLog();
    export let storage:HallStorage = new HallStorage();
    export let audioManager:HallAudioManager = new HallAudioManager();
    export let commonSDK:HallCommonSDK = new HallCommonSDK();
    export let voiceManager:HallVoiceManager = new HallVoiceManager();
    export let replayManager:HallReplayManager = new HallReplayManager();
    export let os:string = HallUtil.getOS();
    export let hotUpdateManager:HallHotUpdateManager = new HallHotUpdateManager();
}