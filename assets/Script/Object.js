// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        clickSound:{
            default: null,
            type: cc.AudioClip
        },

        clickSoundWrong:{
            default: null,
            type: cc.AudioClip
        },
        
        productAtlas:{
            default: null,
            type: cc.SpriteAtlas
        },

        productAtlasWrong:{
            default: null,
            type: cc.SpriteAtlas
        },

        _isTouch: false,
        _tag: null,
    },

    onLoad () {
        this.randomTagAndSetImage();    
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchProduct, this); 
    },

    onTouchProduct(){
        if(this._tag === 1){
            window.scoreGlobal++;
            cc.audioEngine.play(this.clickSound, false, 1);
            if(this._isTouch === false) {
                cc.tween(this.node)
                    .to(1, { position: cc.v2(0, -300), scale: 0.4})
                    .start()
                setTimeout(() => {
                    this.Remove_Node();
                }, 1000);
                console.log("da cham");
                this._isTouch = true;
            }
        }else{
            if(window.scoreGlobal != 0){
                window.scoreGlobal--;
            }
            cc.audioEngine.play(this.clickSoundWrong, false, 1);
        }
    },

    randomTagAndSetImage(){
        this._tag = Math.floor(Math.random() * 3) + 1;
        if(this._tag != 1){
            //lay anh o thu muc bat ki khong chua anh duoc chon
            var random1 = Math.floor(Math.random() * 23);
            // this.getComponent(cc.Sprite).spriteFrame = this.productAtlasWrong.getSpriteFrames()[random1];
        }else{  
            //lay anh se la anh can hoc
            var random2 = Math.floor(Math.random() * 3);
            // this.getComponent(cc.Sprite).spriteFrame = this.productAtlas.getSpriteFrames()[random2];
        }
    },

    Remove_Node(){
        this.node.destroy();
    },

    start () {

    },

    update (dt) {
        if(this.node.x < -700){
            this.Remove_Node();
        }
    },
});
