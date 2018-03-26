/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 20:54:21 
 * @Desc: 文件描述
 */

import { HallBaseModel } from "../../common/HallBaseModel";

 export class HallFriendModel extends HallBaseModel {
    private static instance:HallFriendModel = null;

    private friendDatas:any[] = [];
    private newFriendDatas:any[] = [];

    static getInstance():HallFriendModel{
        if(!this.instance){
            this.instance = new HallFriendModel();
        }
        return this.instance;
    }

    setFriendDatas(friendDatas){
        this.friendDatas = friendDatas;
    }

    getFriendDatas():any[]{
        return this.friendDatas;
    }

    setNewFriendDatas(friendDatas){
        this.newFriendDatas = friendDatas;
    }

    getNewFriendDatas():any[]{
        return this.newFriendDatas;
    }

    getNewFriendData(uid:string) {
        for(let i in this.friendDatas){
            let friendData = this.friendDatas[i];
            if(friendData.uid == uid){
                return friendData;
            }
        }
    }

    addNewFriendData(friendData){
        this.newFriendDatas.push(friendData);
    }


    addFriendData(friendData){
        this.friendDatas.push(friendData);
    }

    removeFriendData(uid){
        for(let i in this.friendDatas){
            let friendData = this.friendDatas[i];
            if(friendData.uid == uid){
                this.friendDatas.splice(i, 1);
                return friendData;
            }
        }
    }

    removeNewFriendData(uid){
        for(let i in this.newFriendDatas){
            let friendData = this.newFriendDatas[i];
            if(friendData.uid == uid){
                this.newFriendDatas.splice(i, 1);
                return friendData;
            }
        }
    }

    removeNewFriendDataByShortId(shortId){
        for(let i in this.newFriendDatas){
            let friendData = this.newFriendDatas[i];
            if(friendData.shortId == shortId){
                this.newFriendDatas.splice(i, 1);
                return friendData;
            }
        }
    }
    
    removeFriendDataByShortId(shortId){
        for(let i in this.friendDatas){
            let friendData = this.friendDatas[i];
            if(friendData.shortId == shortId){
                this.friendDatas.splice(i, 1);
                return;
            }
        }
    }

    isFriend(shortId){
        for(let i in this.friendDatas){
            let friendData = this.friendDatas[i];
            if(friendData.shortId == shortId){
                return true;
            }
        }
    }
}