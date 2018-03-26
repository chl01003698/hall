/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 15:31:51 
 * @Desc: 文件描述
 */

import { SZFightRecordView } from "../fightRecord/SZFightRecordView";
import { h } from "../../../../../../../script/common/H";
import { SZFightReportView } from "./SZFightReportView";
import { SZFightReportModel } from "./SZFightReportModel";
import SZgameModel from "../game/SZgameModel";

export class SZFightReportController {

    static showFightReportView(type,data:any = null) {
        h.log.debug("test===", SZgameModel.getInstance());
        if(!data){
            data = {};
            data.startAt = new Date().toString();
            let players = [];
            let playerMap = SZgameModel.getInstance().getPlayerMap();
            for(let uid in playerMap){
                playerMap[uid]._id = playerMap[uid].id;
                playerMap[uid].user = playerMap[uid];
                players.push(playerMap[uid]);
            }
            data.players = players;
            data.config = SZgameModel.getInstance().getRoomConfig();
            data.roomId = SZgameModel.getInstance().getTableId();
        }
        data 　= data || {
            "_id": "5a7d095f29085532e4c86d7e",
            "createdAt": "2018-02-09T02:39:13.041Z",
            "done": true,
            "startAt": "2018-02-09T02:37:48.505Z",
            "type": "sanzhang",
            "game": "sanzhang",
            "roomId": "924606",
            "owner": "5a7c738d8d376938c8f02f9b",
            "payUIds": [
                /*0*/"5a7c738d8d376938c8f02f9b",
            ],
            "playbackIds": {
            },
            "rounds": [
                /*0*/{
                    "seconds": 21.647,
                    "players": [
                        /*0*/{
                            "uid": "5a7d092f8d376938c8f02fa0",
                            "score": 103,
                            "win": 103,
                            "sid": 1,
                            "giveup": "false",
                            "thanCards": "false",
                            "victory": 1,
                            "cards": [
                                /*0*/"3.2",
                                /*1*/"2.2",
                                /*2*/"2.12",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "duizi",
                        },
                        /*1*/{
                            "uid": "5a7c738d8d376938c8f02f9b",
                            "score": -103,
                            "win": -103,
                            "sid": "0",
                            "giveup": "false",
                            "thanCards": true,
                            "victory": "0",
                            "cards": [
                                /*0*/"2.5",
                                /*1*/"2.7",
                                /*2*/"0.11",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "dantao",
                        },
                    ],
                },
                /*1*/{
                    "seconds": 6.596,
                    "players": [
                        /*0*/{
                            "uid": "5a7d092f8d376938c8f02fa0",
                            "score": 103,
                            "win": 103,
                            "sid": 1,
                            "giveup": "false",
                            "thanCards": "false",
                            "victory": 1,
                            "cards": [
                                /*0*/"3.2",
                                /*1*/"2.2",
                                /*2*/"2.12",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "duizi",
                        },
                        /*1*/{
                            "uid": "5a7c738d8d376938c8f02f9b",
                            "score": -103,
                            "win": -103,
                            "sid": "0",
                            "giveup": "false",
                            "thanCards": true,
                            "victory": "0",
                            "cards": [
                                /*0*/"2.5",
                                /*1*/"2.7",
                                /*2*/"0.11",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "dantao",
                        },
                    ],
                },
                /*2*/{
                    "seconds": 5.809,
                    "players": [
                        /*0*/{
                            "uid": "5a7d092f8d376938c8f02fa0",
                            "score": 103,
                            "win": 103,
                            "sid": 1,
                            "giveup": "false",
                            "thanCards": "false",
                            "victory": 1,
                            "cards": [
                                /*0*/"3.2",
                                /*1*/"2.2",
                                /*2*/"2.12",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "duizi",
                        },
                        /*1*/{
                            "uid": "5a7c738d8d376938c8f02f9b",
                            "score": -103,
                            "win": -103,
                            "sid": "0",
                            "giveup": "false",
                            "thanCards": true,
                            "victory": "0",
                            "cards": [
                                /*0*/"2.5",
                                /*1*/"2.7",
                                /*2*/"0.11",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "dantao",
                        },
                    ],
                },
                /*3*/{
                    "seconds": 5.293,
                    "players": [
                        /*0*/{
                            "uid": "5a7d092f8d376938c8f02fa0",
                            "score": 103,
                            "win": 103,
                            "sid": 1,
                            "giveup": "false",
                            "thanCards": "false",
                            "victory": 1,
                            "cards": [
                                /*0*/"3.2",
                                /*1*/"2.2",
                                /*2*/"2.12",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "duizi",
                        },
                        /*1*/{
                            "uid": "5a7c738d8d376938c8f02f9b",
                            "score": -103,
                            "win": -103,
                            "sid": "0",
                            "giveup": "false",
                            "thanCards": true,
                            "victory": "0",
                            "cards": [
                                /*0*/"2.5",
                                /*1*/"2.7",
                                /*2*/"0.11",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "dantao",
                        },
                    ],
                },
                /*4*/{
                    "seconds": 6.504,
                    "players": [
                        /*0*/{
                            "uid": "5a7d092f8d376938c8f02fa0",
                            "score": 103,
                            "win": 103,
                            "sid": 1,
                            "giveup": "false",
                            "thanCards": "false",
                            "victory": 1,
                            "cards": [
                                /*0*/"3.2",
                                /*1*/"2.2",
                                /*2*/"2.12",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "duizi",
                        },
                        /*1*/{
                            "uid": "5a7c738d8d376938c8f02f9b",
                            "score": -103,
                            "win": -103,
                            "sid": "0",
                            "giveup": "false",
                            "thanCards": true,
                            "victory": "0",
                            "cards": [
                                /*0*/"2.5",
                                /*1*/"2.7",
                                /*2*/"0.11",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "dantao",
                        },
                    ],
                },
                /*5*/{
                    "seconds": 8.81,
                    "players": [
                        /*0*/{
                            "uid": "5a7d092f8d376938c8f02fa0",
                            "score": 103,
                            "win": 103,
                            "sid": 1,
                            "giveup": "false",
                            "thanCards": "false",
                            "victory": 1,
                            "cards": [
                                /*0*/"3.2",
                                /*1*/"2.2",
                                /*2*/"2.12",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "duizi",
                        },
                        /*1*/{
                            "uid": "5a7c738d8d376938c8f02f9b",
                            "score": -103,
                            "win": -103,
                            "sid": "0",
                            "giveup": "false",
                            "thanCards": true,
                            "victory": "0",
                            "cards": [
                                /*0*/"2.5",
                                /*1*/"2.7",
                                /*2*/"0.11",
                            ],
                            "currentRound": "0",
                            "roundCount": 6,
                            "showCards": "false",
                            "leave": "false",
                            "cardsType": "dantao",
                        },
                    ],
                },
            ],
            "players": [
                /*0*/{
                    "user": {
                        "_id": "5a7c738d8d376938c8f02f9b",
                        "shortId": 103362,
                        "headimgurl": "/public/source/headimg.jpg",
                        "isGuest": "false",
                        "nickname": "测试103362",
                    },
                    "_id": "5a7d09d129085532e4c86d7f",
                    "drawCount": "0",
                    "loseCount": "0",
                    "winCount": "0",
                    "score": 200,
                },
                /*1*/{
                    "user": {
                        "_id": "5a7d092f8d376938c8f02fa0",
                        "shortId": 103363,
                        "headimgurl": "/public/source/headimg.jpg",
                        "isGuest": "false",
                        "nickname": "测试103363",
                    },
                    "_id": "5a7d09d129085532e4c86d80",
                    "drawCount": "0",
                    "loseCount": "0",
                    "winCount": "0",
                    "score": -200,
                },
            ],
            "config": {
                "game": "sanzhang",
                "type": "sanzhang",
                "expendIndex": "0",
                "join": true,
                "payway": "owner",
                "private": "false",
                "wanfa": [
                    /*0*/"0",
                ],
                "menpai": [
                    /*0*/10,
                ],
                "bipai": [
                    /*0*/1,
                ],
                "bipai2": [
                    /*0*/1,
                ],
                "daxi": [
                    /*0*/1,
                ],
                "tianlongda": [
                    /*0*/1,
                ],
                "zhahua": [
                    /*0*/1,
                ],
                "lanzi": {
                },
                "tianlong": {
                },
                "dilong": {
                },
                "dilongda": {
                },
                "zhongtu": {
                },
                "sunzi": {
                },
                "mensanlun": {
                },
                "roundCount": 6,
            },
            "currentRound": 6,
            "roundCount": 6,
        };
        SZFightReportModel.getInstance().setData(data);
        let view = new SZFightReportView(type);
        h.viewManager.pushView(view);
    }
}