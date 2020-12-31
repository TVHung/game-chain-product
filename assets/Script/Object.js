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

        _isTouch: false,
        _isHandle: true,
        _typeBox: 2,
        _tag: null,
        _lesson: "",
    },

    onLoad () {
        this._lesson = window.lesson;

        arr_lessonTrue = new Array();
        arr_lessonFalse = new Array();
        arr_typeBoxTrue = new Array();
        arr_typeBoxFalse = new Array();
        cc.loader.loadRes('GameChainProduct/lessons.json', function (err, object) {             //get data from json file
            if (err) {
                console.log(err);
                return;
            }
            this.arr_lessonTrue = object.json.lessons[this._lesson].lessonTrue;
            this.arr_lessonFalse = object.json.lessons[this._lesson].lesonFalse;
            this.arr_typeBoxTrue = object.json.lessons[this._lesson].typeBoxTrue;
            this.arr_typeBoxFalse = object.json.lessons[this._lesson].typeBoxFalse;
            this.randomTagAndSetImage();        
        }.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchProduct, this); 
    },

    onTouchProduct(){
        if(this.node.x > -370 && this._isTouch === false){
            if(this._tag === 1){
                window.scoreGlobal++;
                cc.audioEngine.play(this.clickSound, false, 1);
                var time = this.tinhTime(this.node.x);

                if(this._isTouch === false) {
                    var scaleBox;
                    if(this._typeBox === 1){
                        scaleBox = 0.9;
                    }else{
                        scaleBox = 0.5;
                    }
                    setTimeout(() => {
                        cc.tween(this.node)
                            .to(0.5, { position: cc.v2(-370, 50), scale: scaleBox})
                            .start()
                        setTimeout(() => {
                            this.Remove_Node();
                        }, 500);
                    }, time);
                    
                    console.log("da cham");
                    this._isTouch = true;
                }
                this.node.getChildByName("brightBorder").active = true;
            }else{
                if(window.scoreGlobal != 0){
                    window.scoreGlobal--;
                }
                cc.audioEngine.play(this.clickSoundWrong, false, 1);
            }
            this._isTouch = true;
        }
    },

    tinhTime(x){
        var time = (((x - (-370)) * window.speedProduct)/1440) * 1000;
        return time;
    },

    randomTagAndSetImage(){
        this._tag = Math.floor(Math.random() * 3) + 1;
        if(this._tag != 1){                                 //hang sai
            this.handleRandomImageAndSizeBox(this.node, 2);
        }else{                                              //hang dung
            this.handleRandomImageAndSizeBox(this.node, 1);
        }
    },

    handleRandomImageAndSizeBox(node, typeProduct){
        var nameImage;
        var randomImg;
        var length;
        if(typeProduct === 1){
            length = this.arr_lessonTrue.length;
            randomImg = Math.floor(Math.random() * length);
            nameImage = this.arr_lessonTrue[randomImg];
            this._typeBox = this.arr_typeBoxTrue[randomImg];
        }else{
            length = this.arr_lessonFalse.length;
            randomImg = Math.floor(Math.random() * length);
            nameImage = this.arr_lessonFalse[randomImg];
            this._typeBox = this.arr_typeBoxFalse[randomImg];
        }
        //load box
        cc.loader.loadRes('GameChainProduct/Sprite/daychuyen/box' + this._typeBox, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }else{
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });
        var anhsangbox = "anhsangbox" + this._typeBox;
        cc.loader.loadRes('GameChainProduct/Sprite/daychuyen/' + anhsangbox , cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }else{
                var brightBorder = node.getChildByName("brightBorder");
                brightBorder.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });
        
        //lấy ảnh
        cc.loader.loadRes('GameChainProduct/Sprite/imgLesson/' + nameImage, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }else{
                var imgContent = node.getChildByName("imgContent");
                imgContent.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });
        
    },

    runObjectProduct(speed){
        cc.tween(this.node)
            .to(speed, { position: cc.v2(-720, -100)})
            .start()
    },

    Remove_Node(){
        this.node.destroy();
    },

    start () {

    },

    update (dt) {
        if(this.node.x < -800){
            this.Remove_Node();
        }
    },
});
