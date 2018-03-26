/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-25 17:44:42 
 * @Desc: 语音管理
 */

import { HallUtil } from "../util/HallUtil";
import { HallConstant } from "../view/hall/HallConstant";
import { HallToast } from "../common/HallToast";
import { h } from "../common/H";

 export class HallVoiceManager {

    init(){
        return;
        if(HallUtil.isNative()){
            gvoice.GetVoiceEngine().SetAppInfo("1782281001","b67fa86b264c87d6d212c7754cdbd336", "E81DCA1782C5CE8B0722A366D7ECB41F");
            var initCode = gvoice.GetVoiceEngine().Init();
            if(initCode != HallConstant.GCloudVoiceErrno.GCLOUD_VOICE_SUCC){
                cc.log("gvoice初始化不成功");
                return;
            }else{
                cc.log("gvoice成功");
            }
            var gvoiceNotify = gvoice.GCloudVoiceNotify.Create();
            gvoiceNotify.SetDelegate(function(funcName, args){
                cc.log("funcName====", funcName);
                if(funcName == "OnUploadFile"){
                    var code = args.code;
                    var filePath = args.filePath;
                    var fileID = args.fileID;
                    cc.log("OnUploadFile==", code, filePath, fileID);
                    h.eventManager.dispatchEvent(HallConstant.Event.uploadedVoice, {fileID:args.fileID});
                }else if(funcName == "OnDownloadFile"){
                    var code = args.code;
                    var filePath = args.filePath;
                    var fileID = args.fileID;
                    cc.log("OnDownloadFile==", code, filePath, fileID);
                    gvoice.GetVoiceEngine().PlayRecordedFile(filePath);
                }else if(funcName == "OnApplyMessageKey"){
                    cc.log("haha====", args.code);
                }else if(funcName == "OnPlayRecordedFile"){
                    cc.log("OnPlayRecordedFile==", args.code);
                }
            })
            gvoice.GetVoiceEngine().SetNotify(gvoiceNotify);
            // 默认为语音消息模式
            var value = gvoice.GetVoiceEngine().SetMode(HallConstant.GCloudVoiceMode.Messages);
            var value2 = gvoice.GetVoiceEngine().ApplyMessageKey(6000);
            cc.log("gvoiceinit:", value, value2);
            HallUtil.schedule(function(){
                gvoice.GetVoiceEngine().Poll();
            }, cc.director.getScene(), 1, true);
        }
    }

    bindButton(button:cc.Node){
        button.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("touch_start");
            var code = gvoice.GetVoiceEngine().StartRecording(jsb.fileUtils.getWritablePath() + "voicetemp.bat");
            cc.log("code===", code);
        });
        button.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("touch_end");
            var retCode = gvoice.GetVoiceEngine().StopRecording();
            gvoice.GetVoiceEngine().UploadRecordedFile(jsb.fileUtils.getWritablePath() + "voicetemp.bat");
        });

        button.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            cc.log("touch_cancel");
            var retCode = gvoice.GetVoiceEngine().StopRecording();
            HallToast.show("取消发送语音");
        });
    }
 }
