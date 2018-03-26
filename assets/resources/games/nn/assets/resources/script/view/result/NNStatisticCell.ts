import { NNGameUtil } from "../../common/NNGameUtil";
import NNgameControler from "../game/NNgameControler";
import { NNConstant } from "../../common/NNConstant";
import { PlayerStatistic } from "./NNStatisticLayer";
import { h } from "../../../../../../../script/common/H";
import NNgameModel from "../game/NNgameModel";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/StatisticCell")
export default class NNStatisticCell extends cc.Component {
  
  // 头像
  @property(cc.Sprite)
  headImg:cc.Sprite
  
  // 玩家名称
  @property(cc.Label)
  playerName:cc.Label
  
  // 桌主的标签
  @property(cc.Label)
  ownerTip:cc.Label
  
  // 统计数据数组
  @property([cc.Label])
  labelData:cc.Label[] = []
  
  // 总分
  @property(cc.Label)
  labelScore:cc.Label
  
  // 大赢家图标
  @property(cc.Sprite)
  winImg:cc.Sprite

  /**
   * @param data from server
   */
  setData(data:PlayerStatistic, isWinner:boolean) {
    let gameModel = NNgameModel.getInstance()
    let playerData = gameModel.getPlayerData(data.uid)
    this.ownerTip.node.active = (gameModel.getTableData().ownerId == playerData.id)
    // cc.loader.load(playerData.headimgurl, function (err, texture) {
    //     this.headImg.spriteFrame = new cc.SpriteFrame(texture)
    // })
    
    h.log.debug('----wx in NNStatisticCell.setData data = ', data, ', playerData = ', playerData, ', gameModel.getTableData().ownerId = ', gameModel.getTableData().ownerId);

    this.playerName.string = playerData.nickname
    this.labelData[0].string = '' + data.niuniuCount
    this.labelData[1].string = '' + data.wuniuCount
    this.labelData[2].string = '' + data.winCount
    this.labelScore.string = '' + data.score
    this.winImg.node.active = isWinner
  }
}
