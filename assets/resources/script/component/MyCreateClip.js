/**
 *  var clip = this.clipAni.addComponent('MyCreateClip') ;
 *
 *       var clipData = {
 *           path: 'texture/emoji',
 *          name: 'anger',
 *           frameRate: 5,
 *           loop: true,
 *       } ;
 *       clip.init(clipData) ;
 *       clip.play();
 * 
 * 
 */


"use strict";

import {HallViewConfig} from "../config/HallViewConfig";

cc.Class({
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: "369/frameClip",
        disallowMultiple: true,
    },

    properties: {
        path: {
            default: "",
            tooltip: "atlas 路径",
        },
        clipName: {
            default: "",
            tooltip: "帧动画名字",
        },

        frameRate: {
            default: 5,
            tooltip: "帧速率/每秒播多少帧",
        },

        loop: {
            default: false,
            tooltip: "是否循环播放",
        },
        //现在已经不是异步加载了
        //_loadFinish: false, // 加载是否完成

        //_play: false, // 
    },

    _addClip: function () {
        var self = this;
        var animation = this.getComponent(cc.Animation);
        this.node.active = true;

        animation.on('play',      this.onPlay,        this);
        animation.on('stop',      this.onStop,        this);    //每次播完用这个
        animation.on('lastframe', this.onLastFrame,   this);
        animation.on('finished',  this.onFinished,    this);
        animation.on('pause',     this.onPause,       this);
        animation.on('resume',    this.onResume,      this);
        
        var atlas = cc.loader.getRes(HallViewConfig.getSearchPath() + this.path,cc.SpriteAtlas);
        var spriteFrames = atlas.getSpriteFrames();
        var newSpriteFrames = self._getFramesByName(spriteFrames);
        cc.log('cc.loader.getRes' + JSON.stringify(newSpriteFrames));
        
        self.clip = cc.AnimationClip.createWithSpriteFrames(newSpriteFrames, self.frameRate);

        self.clip.name = 'run';

        if(self.loop) {
            self.clip.wrapMode = cc.WrapMode.Loop;
        }else {
            self.clip.wrapMode = cc.WrapMode.Normal;
        }
        animation.addClip(self.clip);

        // self._loadFinish = true ;
        // if(true == self._play){
        //     animation.play('run');
        // }
        //animation.play('run');
    },

    ctor: function() {
        // 
    },

    init: function (clipInfo) {
        this.path = clipInfo.path;
        this.clipName = clipInfo.name;
        this.frameRate = clipInfo.frameRate;
        this.loop = clipInfo.loop;

        this._addClip();
    },

    play: function(){
        // if(true == this._loadFinish)
        // {
        //     var animation = this.getComponent(cc.Animation);
        //     animation.play('run');
        // }
        // this._play = true ;
        var animation = this.getComponent(cc.Animation);
        animation.play('run');
    }, 

    onPlay: function(){
        cc.log('onPlay') ;
    },

    onStop: function(){
        cc.log('onStop') ;
        this.node.active = false;
    },

    onLastFrame: function(){
        cc.log('onLastFrame') ;
    },

    onFinished: function(){
        //this.node.destroy() ;
        cc.log('onFinished');
        this.onDestroy();
    },

    onPause: function () {
        cc.log('onPause');
    },

    onResume: function () {
        cc.log('onResume');
    },

    _getFramesByName: function (spriteFrames) {
         var newSpriteFrames = [];
         var self = this ;
         for(var i=0;i<spriteFrames.length;i++) {
             var str = spriteFrames[i]._name.slice(0,this.clipName.length);
             if(str == this.clipName) {
                 newSpriteFrames.push(spriteFrames[i]);
             }
         }
         newSpriteFrames.sort(function (a, b) {
            var start = self.clipName.length + 1 ;
            var aIndexStr = a._name.substr(start, a._name.length);
            var bIndexStr = b._name.substr(start, b._name.length);
            var aIndex = parseInt(aIndexStr);
            var bIndex = parseInt(bIndexStr);
            return aIndex - bIndex;
         });
         return newSpriteFrames;
    },

    start: function() {

    },

    onDestroy: function () {
        var animation = this.getComponent(cc.Animation);
        animation.off('play',      this.onPlay,        this);
        animation.off('stop',      this.onStop,        this);
        animation.off('lastframe', this.onLastFrame,   this);
        animation.off('finished',  this.onFinished,    this);
        animation.off('pause',     this.onPause,       this);
        animation.off('resume',    this.onResume,      this);
    }
});
