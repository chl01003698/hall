/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-24 22:38:56 
 * @Desc: SDK
 */


import { HallSDKConstant } from "./HallSDKConstant";
import { HallStringUtil } from "../util/HallStringUtil";
import { h } from "../common/H";
import { HallConstant } from "../view/hall/HallConstant";
import { HallUtil } from "../util/HallUtil";
import { HallToast } from "../common/HallToast";
import { HallUIUtil } from "../util/HallUIUtil";


export let CommonSDKEvent = "hallSdk";

export class HallCommonSDK {
    private className = "com.sanliujiugame.shurendoudizhu.sdk.CommonSDK";

    init(){
        // h.eventManager.addListener(HallConstant.Event.sdk, function(data){
        //     h.log.debug("haha123===");
        // }, this);
    }

    /**
     * [shareImage 分享图片]
     * @param  {[string]} filePath 	[图片路径]
     * @param  {[number]} scene    	[分享场景(默认分享到好友)]
     * @return {[null]}
     */
    shareImage (filePath:string, scene:HallSDKConstant.SceneType = HallSDKConstant.SceneType.session, callback:Function = null){
        if(!HallUtil.isNative()){
            return;
        }
        if(scene == null){
            scene = HallSDKConstant.SceneType.session;
        }
        var type = "'type':" + HallSDKConstant.ShareType.image;
        var sceneStr = "'scene':" + scene;
        var path = HallStringUtil.format("'path':'{0}'", filePath);
        var jsonStr = HallStringUtil.format("{{0},{1},{2}}", type, sceneStr, path);

        jsb.reflection.callStaticMethod(this.className, "shareWX", "(Ljava/lang/String;)V", jsonStr);
        h.eventManager.addListener(CommonSDKEvent,function(data){
            if(data.errCode == HallSDKConstant.ErrCode.ERR_OK){
                if(callback){
                    callback(data);
                }
            }
        }, h.viewManager.getGameStartView(), 1);
    }

    /**
     * [shareWebpage 分享网页]
     * @param  {[string]} url   [网页地址]
     * @param  {[string]} title [网页标题]
     * @param  {[string]} desc  [网页描述]
     * @param  {[number]} scene [分享场景(默认分享到好友)]
     * @return {[null]}       [description]
     */
    shareWebpage (url:string, title:string, desc:string, scene:HallSDKConstant.SceneType = HallSDKConstant.SceneType.session){
        if(!HallUtil.isNative()){
            return;
        }
        if(scene == null){
            scene = HallSDKConstant.SceneType.session;
        }
        var type = "'type':" + HallSDKConstant.ShareType.webpage;
        url = HallStringUtil.format("'url':'{0}'", url);
        title = HallStringUtil.format("'title':'{0}'", title);
        desc = HallStringUtil.format("'desc':'{0}'", desc);
        var sceneStr = "'scene':" + scene;
        var jsonStr = HallStringUtil.format("{{0},{1},{2},{3},{4}}", type, url, title, desc, sceneStr);
        jsb.reflection.callStaticMethod(this.className, "shareWX", "(Ljava/lang/String;)V", jsonStr);
    }

    /**
     * [login 登录]
     * @param  {[string]} sdkName [sdk名字]
     * @return {[type]}         [description]
     */
    login(callback:Function, sdkName:HallSDKConstant.LoginType = HallSDKConstant.LoginType.wx){
        switch(sdkName){
            // 微信
            case HallSDKConstant.LoginType.wx:
                jsb.reflection.callStaticMethod(this.className, "loginWX", "()V");
        }
        h.eventManager.addListener(HallConstant.Event.sdk, function(data){
            if(callback){
                callback(data);
            }
        }.bind(this), cc.director.getScene(), 1);
    }

    cutImage (srcPath:string, destPath:string, x:number, y:number, width:number, height:number){
        if(!HallUtil.isNative()){
            return;
        }
        x = Math.ceil(x) + 1;
        y = Math.ceil(y) + 1;
        width = Math.floor(width)- 2;
        height = Math.floor(height) - 2;
        srcPath = HallStringUtil.format("'srcPath':'{0}'", srcPath);
        destPath = HallStringUtil.format("'destPath':'{0}'", destPath);
        let xStr = "'x':" + x;
        let yStr = "'y':" + y;
        let widthStr = "'width':" + width;
        let heightStr = "'height':" + height;
        let jsonStr = HallStringUtil.format("{{0},{1},{2},{3},{4},{5}}", srcPath, destPath, xStr, yStr, widthStr, heightStr);
        jsb.reflection.callStaticMethod(this.className, "cutImage", "(Ljava/lang/String;)V", jsonStr);
    }

    saveToAlbum (srcPath){
        if(!HallUtil.isNative()){
            return;
        }
        jsb.reflection.callStaticMethod(this.className, "saveToAlbum", "(Ljava/lang/String;)V", srcPath);
    }

    /**
     * [screenshot 截屏]
     * @param  {[type]} node     [description]
     * @param  {[type]} filename [description]
     * @param  {[type]} callfunc [description]
     * @return {[type]}          [description]
     */
    screenshot(node, filename, callfunc){
        if(!HallUtil.isNative()){
            return;
        }
        filename = filename ? filename : "screenshot.png";
        var size = node.getContentSize();
        var winSize = cc.director.getVisibleSize();

        var renderTexture = cc.RenderTexture.create(winSize.width, winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        if(node.parent != null){
            node.parent._sgNode.addChild(renderTexture);
        }else{
            node.addChild(renderTexture);
        }
        renderTexture.setVisible(false);
        renderTexture.begin();
        if(node._sgNode != null){
            node._sgNode.visit();
        }else{
            node.visit();
        }
        renderTexture.end();
        var fullPath = jsb.fileUtils.getWritablePath() + filename;
        renderTexture.saveToFile(filename, cc.ImageFormat.PNG, false, function(){
            renderTexture.removeFromParent();
            callfunc(fullPath, filename);
        });
    };

    /**
     * [copy 到剪贴板]
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    copy (text){
        if(!HallUtil.isNative()){
            return;
        }
        jsb.reflection.callStaticMethod(this.className, "copy", "(Ljava/lang/String;)V", text);
    }

    /**
     * [getBatteryNum 电量]
     * @return {[type]} [description]
     */
    getBatteryNum (){
        if(!HallUtil.isNative()){
            return;
        }
        return jsb.reflection.callStaticMethod(this.className, "getBatteryNum", "()I");
    }

    /**
     * [getNetSignal 网络强度]
     * @return {[type]} [description]
     */
    getNetSignal(){
        if(!HallUtil.isNative()){
            return;
        }
        var signal = 100 + jsb.reflection.callStaticMethod(this.className, "getNetSignal", "()I");
        if(signal < 0){
            signal = 0;
        }
        return signal;
    }

    checkHaveNet(){
        if(!HallUtil.isNative()){
            return true;
        }
        //
        let blnHaveNet = jsb.reflection.callStaticMethod(this.className, "isNetworkAvailable", "()Z");
        h.log.debug("blnHaveNet=" + blnHaveNet);
        return blnHaveNet;
    }

    getGPSInfo(){
        if(!HallUtil.isNative()){
            return;
        }
        var gpsStr = jsb.reflection.callStaticMethod(this.className, "getGPSInfo", "()Ljava/lang/String;");
        var gpsArray = gpsStr.split(',');
        var gpsInfo:any = {
            EW:parseFloat(gpsArray[0]),
            SN:parseFloat(gpsArray[1])
        }
        gpsInfo.desc = HallUIUtil.getGPSDesc(gpsInfo.EW, gpsInfo.SN);
        return gpsInfo
    }

    pay(jsonStr:string){
        if(!HallUtil.isNative()){
            return;
        }
        return jsb.reflection.callStaticMethod(this.className, "pay", "(Ljava/lang/String;)V", jsonStr);
    }

    getMwurl():string{
        if(!HallUtil.isNative()){
            return;
        }
        return jsb.reflection.callStaticMethod(this.className, "getMwurl", "()Ljava/lang/String;");
    }

    cleanWmurl(){
        if(!HallUtil.isNative()){
            return;
        }
        return jsb.reflection.callStaticMethod(this.className, "setMwurl", "(Ljava/lang/String;)", "");
    }
}