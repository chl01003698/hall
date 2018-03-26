/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 15:31:51 
 * @Desc: 文件描述
 */

import { NNFightRecordView } from "../fightRecord/NNFightRecordView";
import { h } from "../../../../../../../script/common/H";
import { NNFightReportView } from "./NNFightReportView";
import { NNFightReportModel } from "./NNFightReportModel";

export class NNFightReportController {

    static showFightReportView() {
        let data = {
            "_id":"5a7c12be77701b2edc7e379f",
            "createdAt":"2018-02-08T09:14:23.734Z",
            "done":true,
            "startAt":"2018-02-08T09:13:18.002Z",
            "type":"sanzhang",
            "game":"sanzhang",
            "roomId":"197563",
            "owner":"5a7bcaa38452de2114e29f5d",
            "payUIds":[
                /*0*/"5a7bcaa38452de2114e29f5d",
             ],
            "playbackIds":{
             },
            "rounds":[
                /*0*/{
                    "seconds":13.72,
                    "players":[
                        /*0*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":104,
                            "win":104,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"0.11",
                                /*1*/"2.11",
                                /*2*/"0.13",
                             ],
                            "currentRound":"0",
                            "roundCount":6,
                            "showCards":"false",
                            "leave":"false",
                         },
                        /*1*/{
                            "uid":"5a7bca9f8452de2114e29f5b",
                            "score":"0",
                         },
                     ],
                 },
                /*1*/{
                    "seconds":6.468,
                    "players":[
                        /*0*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":104,
                            "win":104,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"0.11",
                                /*1*/"2.11",
                                /*2*/"0.13",
                             ],
                            "currentRound":"0",
                            "roundCount":6,
                            "showCards":"false",
                            "leave":"false",
                         },
                        /*1*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":305,
                            "win":201,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"1.7",
                                /*1*/"2.4",
                                /*2*/"3.14",
                             ],
                            "currentRound":1,
                            "roundCount":6,
                            "showCards":true,
                            "leave":"false",
                         },
                     ],
                 },
                /*2*/{
                    "seconds":1.438,
                    "players":[
                        /*0*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":104,
                            "win":104,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"0.11",
                                /*1*/"2.11",
                                /*2*/"0.13",
                             ],
                            "currentRound":"0",
                            "roundCount":6,
                            "showCards":"false",
                            "leave":"false",
                         },
                        /*1*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":305,
                            "win":201,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"1.7",
                                /*1*/"2.4",
                                /*2*/"3.14",
                             ],
                            "currentRound":1,
                            "roundCount":6,
                            "showCards":true,
                            "leave":"false",
                         },
                     ],
                 },
                /*3*/{
                    "seconds":3.773,
                    "players":[
                        /*0*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":104,
                            "win":104,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"0.11",
                                /*1*/"2.11",
                                /*2*/"0.13",
                             ],
                            "currentRound":"0",
                            "roundCount":6,
                            "showCards":"false",
                            "leave":"false",
                         },
                        /*1*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":305,
                            "win":201,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"1.7",
                                /*1*/"2.4",
                                /*2*/"3.14",
                             ],
                            "currentRound":1,
                            "roundCount":6,
                            "showCards":true,
                            "leave":"false",
                         },
                     ],
                 },
                /*4*/{
                    "seconds":3.589,
                    "players":[
                        /*0*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":104,
                            "win":104,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"0.11",
                                /*1*/"2.11",
                                /*2*/"0.13",
                             ],
                            "currentRound":"0",
                            "roundCount":6,
                            "showCards":"false",
                            "leave":"false",
                         },
                        /*1*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":305,
                            "win":201,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"1.7",
                                /*1*/"2.4",
                                /*2*/"3.14",
                             ],
                            "currentRound":1,
                            "roundCount":6,
                            "showCards":true,
                            "leave":"false",
                         },
                     ],
                 },
                /*5*/{
                    "seconds":4.333,
                    "players":[
                        /*0*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":104,
                            "win":104,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"0.11",
                                /*1*/"2.11",
                                /*2*/"0.13",
                             ],
                            "currentRound":"0",
                            "roundCount":6,
                            "showCards":"false",
                            "leave":"false",
                         },
                        /*1*/{
                            "uid":"5a7bcaa38452de2114e29f5d",
                            "score":305,
                            "win":201,
                            "sid":"0",
                            "giveup":"false",
                            "thanCards":"false",
                            "victory":1,
                            "cards":[
                                /*0*/"1.7",
                                /*1*/"2.4",
                                /*2*/"3.14",
                             ],
                            "currentRound":1,
                            "roundCount":6,
                            "showCards":true,
                            "leave":"false",
                         },
                     ],
                 },
             ],
            "players":[
                /*0*/{
                    "user":{
                        "_id":"5a7bcaa38452de2114e29f5d",
                        "shortId":103231,
                        "headimgurl":"/public/source/headimg.jpg",
                        "isGuest":"false",
                        "nickname":"测试103231",
                     },
                    "_id":"5a7c14ef77701b2edc7e37a2",
                    "drawCount":"0",
                    "loseCount":"0",
                    "winCount":"0",
                    "score":405,
                 },
                /*1*/{
                    "user":{
                        "_id":"5a7bca9f8452de2114e29f5b",
                        "shortId":103230,
                        "headimgurl":"/public/source/headimg.jpg",
                        "isGuest":"false",
                        "nickname":"测试103230",
                     },
                    "_id":"5a7c14ef77701b2edc7e37a3",
                    "drawCount":"0",
                    "loseCount":"0",
                    "winCount":"0",
                    "score":1013,
                 },
             ],
            "config":{
                "game":"sanzhang",
                "type":"sanzhang",
                "expendIndex":"0",
                "join":true,
                "payway":"owner",
                "private":"false",
                "wanfa":[
                    /*0*/"0",
                 ],
                "menpai":[
                    /*0*/10,
                 ],
                "bipai":[
                    /*0*/1,
                 ],
                "bipai2":[
                    /*0*/1,
                 ],
                "daxi":[
                    /*0*/1,
                 ],
                "tianlongda":[
                    /*0*/1,
                 ],
                "zhahua":[
                    /*0*/1,
                 ],
                "lanzi":{
                 },
                "tianlong":{
                 },
                "dilong":{
                 },
                "dilongda":{
                 },
                "zhongtu":{
                 },
                "sunzi":{
                 },
                "mensanlun":{
                 },
                "roundCount":6,
             },
            "currentRound":6,
            "roundCount":6,
         };
        NNFightReportModel.getInstance().setData(data);
        let view = new NNFightReportView();
        h.viewManager.pushView(view);
    }
 }