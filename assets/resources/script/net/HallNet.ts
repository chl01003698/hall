/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-16 14:29:06 
 * @Desc: 网络
 */

import { HallNetHandler } from "./HallNetHandler";
import { h } from "../common/H";
import { HallAlert } from "../common/HallAlert";
import { HallNetWaiting } from "../common/HallNetWaiting";
import { HallNetConfig } from "./HallNetConfig";

export class HallNet {
    private static instance: HallNet = null;
    private reconnectCount: number = 0;
    private socket: WebSocket = null;
    private static routeIndex: number = 0;
    private listeners: any = {};
    //是否是主动断开连接
    public static isManualDis: boolean = false;
    static getInstance(): HallNet {
        if (this.instance == null) {
            this.instance = new HallNet();
        }
        return this.instance;
    }

    initPomelo(host: string, port: string, callback: Function) {
        h.log.debug("连接网关服务器:" + host + ":" + port);
        h.log.debug(h.pomelo.init);
        HallNet.isManualDis = false;
        //注册网关网络接口
        let pomelo = h.pomelo.init({
            host: host,
            port: port,
            log: true,
            encrypt: false
        }, function () {
            h.log.debug("连接成功");
            var route = HallNetHandler.gate.gateHandler.queryEntry;
            h.log.debug("====================发送socket请求begin==================");
            h.log.debug("route:" + route);
            h.log.debug("====================发送socket请求end==================");
            h.pomelo.request(route, {

            }, function (data) {
                h.log.debug("====================收到socket返回数据begin==================");
                h.log.debug("route:" + route);
                h.log.logObj(data);
                h.log.debug("====================收到socket返回数据end==================");
                if(data.code != HallNetConfig.RESP_CODE.SUCCEED){
                    h.log.debug(data.msg);
                    return;
                }
                //关闭之前的socket
                HallNet.isManualDis = true;
                h.pomelo.disconnect();
                //连接成功，重连次数重置
                this.reconnectCount = 0;
                //根据服务器返回的ip和port再链接一次登陆服务器 
                this.initSocket(data.data.host, data.data.port, callback);

            }.bind(this));
        }.bind(this));
        this.regAllPush();
    }
    //连接登陆服务器
    initSocket(host: string, port: string, callback: Function) {
        this.socket = h.pomelo.init({
            host: host,
            port: port,
            log: true,
            encrypt: false
        }, function () {
            h.log.debug("pomelo....连接成功");
            if (callback) {
                callback();
            }
        });
        //h.log.debug("pomelo.....this.socket" + this.socket);
        //h.log.logObj(this.socket);
        this.regReconnectPush();
    }

    

    regReconnectPush() {
        h.log.debug("regReconnectPush.....");
        h.pomelo.removeAllListeners(["reconnect","error" ,"close", "disconnect", "io-error", "onKick", "heartbeat timeout"]);
        h.pomelo.on("disconnect", function (event) {
            //h.log.logObj(event);
            // h.log.debug("HallNetConfig.port" + HallNetConfig.port);
            // h.log.debug("indexof=" + event.target.url.indexOf(HallNetConfig.port));
            if (event.target.url) {
                var arr = event.target.url.split(":");
                if (arr[2] == "3000/" || arr[2] == "3000") {
                    h.log.debug("pomelo..ddd.3000 dis");
                    //手动断开网关服务器，不显示等待框，只有重连不成功的时候才弹
                    if(!HallNet.isManualDis){
                        HallNetWaiting.show();
                    }
                    HallNet.isManualDis = false;
                } else {
                    h.log.debug("pomelo..ddddd.3010 dis");
                    //监听到游戏服务器断开，弹出联网等待框
                    HallNetWaiting.show();
                }
            }

        });

        h.pomelo.on("close", function (event) {
            h.log.debug("pomelo...close");
        });
    }
    regAllPush() {
        h.pomelo.removeAllListeners(["allPush"]);
        h.pomelo.on("allPush", function (route, data) {
            h.log.debug("/////////////////////收到socket推送数据begin//////////////////");
            h.log.debug("route:" + route);
            h.log.logObj(data);
            h.log.debug("/////////////////////收到socket推送数据end////////////////////");
            for (let k in this.listeners) {
                let listener = this.listeners[k];
                if (listener.route == route) {
                    listener.callback(data)
                }
            }
        }.bind(this));
    }

    // 关闭连接
    disconnect() {
        h.pomelo.disconnect();
        this.socket = null;
    }

    // 发送数据
    sendData(route: string, callback: Function, data: any = null, err: boolean = false) {
        let routeSign: string = HallNet.getRouteSign(route);
        h.log.debug("====================发送socket请求begin==================");
        h.log.debug("routeSign:" + routeSign);
        h.log.logObj(data);
        h.log.debug("====================发送socket请求end==================");
        h.pomelo.request(route, data, function (data) {
            h.log.debug("====================收到socket返回数据begin==================");
            h.log.debug("routeSign:" + routeSign);
            h.log.logObj(data);
            h.log.debug("====================收到socket返回数据end==================");
            if (data.msg) {
                HallAlert.show(data.msg);
                if (err && callback) {
                    callback(data);
                }
            } else if (callback) {
                callback(data);
            }
        });
    }

    regPush(route: string, callback: Function, sign: string = "default") {
        //h.pomelo.removeAllListeners([route]);
        //h.pomelo.on(route, callback);
        this.listeners[sign + route] = { sign: sign, route: route, callback: callback };
    }

    static getRouteSign(route: string) {
        return route + "_" + ++this.routeIndex;
    }

    getUrl(host: string, port: string): string {
        let url: string = 'ws://' + host;
        if (port) {
            url += ':' + port;
        }
        return url;
    }
}