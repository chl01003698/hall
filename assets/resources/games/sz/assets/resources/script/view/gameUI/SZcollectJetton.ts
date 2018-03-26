

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZcollectJetton")
export default class SZcollectJetton extends cc.Component {
   @property([sp.Skeleton]) 
   collectJectton:sp.Skeleton[] = [];

   playAnimation(index) {
       this.collectJectton[index].node.active = true;
    //    if(index == 1 || index == 2) {
    //         this.collectJectton[index].setAnimation(0,'PlayerRight',false);
    //    }else if(index == 3 || index == 4) {
    //         this.collectJectton[index].setAnimation(0,'PlayerLeft',false);
    //    }else {
    //         this.collectJectton[index].setAnimation(0,'player',false);
    //    }
       this.collectJectton[index].setAnimation(0,'animation',false);
   }

   hideAllJetton() {
        this.collectJectton.forEach(function(element) {
            element.node.active = false;
        })
   }
   
}
