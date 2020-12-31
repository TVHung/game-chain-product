// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        
    },

    runChain(speed){
        cc.tween(this.node)
            .to(speed, { position: cc.v2(window.screenWidth*(-1), -160)})
            .start()
    },

    Remove_Node(){
        this.node.destroy();
    },

    update (dt) {
        if(this.node.x <= window.screenWidth*(-1)){
            this.Remove_Node();
        }
    },
});
