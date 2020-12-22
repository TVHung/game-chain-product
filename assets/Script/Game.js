var Level = cc.Enum({
    level1: 40,
    level2: 80,
    level3: 120
});

var Speed = cc.Enum({
    speed1: 4,
    speed2: 3,
    speed3: 2
});

var Duration = cc.Enum({
    duration1: 11/18,
    duration2: 11/24,
    duration3: 11/36
});

cc.Class({
    extends: cc.Component,

    properties: {
        objectPrefab: {
            default: null,
            type: cc.Prefab
        },
        wheelPrefab: {
            default: null,
            type: cc.Prefab
        },
        check: {
            default: null,
            type: cc.Prefab         
        },
        timeRollerBar: {            //thanh hiển thị thời gian
            default: null,
            type: cc.Sprite
        },
        timeRollerStep: {           //bước nhảy của time
            default: 0,
            range: [0, 2, 0.1],
            slide: true
        },
        countDown: {
            default: null,
            type: cc.Prefab
        },
        icon: {                     //icon 
            default: null,
            type: cc.SpriteAtlas
        },
        character: {
            default: null,
            type: cc.Node
        },
        score:{
            default: null,
            type: cc.Label
        },

        tableResult:{
            default: null,
            type: cc.Node
        },
        scoreTable:{
            default: null,
            type: cc.Label
        },

        _isWin: false,
        _productNode: null,
        _level: 1,
        _speed: 0,
        _duration: 0.7,
        _checkCovu1: true,
        _checkCovu2: true,
        _nextLevel: true,
        _countProduct: 0,
        _totalProduct: 100,
    },

    start () {
        setTimeout(()=>{
            // this.node.getComponent("SoundManager").playBackGroundSound();
        }, 2500);
    },

    onLoad () {
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.debug.setDisplayStats(false);

        window.scoreGlobal = 0;
        window._isGameOver = false;
        this.score.string = window.scoreGlobal;
        this._speed = Speed.speed1;
        this._duration = Duration.duration1;
        arrPositionWheel = new Array();
        this.runBackground();

        //chạy aniamtion nhan vat dong hanh
        this.character.getComponent(cc.Animation).play('monsterIn');
        cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con hãy chọn những\nvật theo yêu cầu!';
        this.node.getComponent("SoundManager").playEffectSound("batdau", false);   
        setTimeout(() => {
            cc.find("Canvas/Background/LevelTable").getComponent(cc.Animation).play('levelTable');
            cc.find("Canvas/Background/LevelTable/Level label").getComponent(cc.Label).string = 'Level 1';
        }, 1000); 
        setTimeout(() => {
            this.character.getComponent(cc.Animation).play('monsterOut');
            this.startTimeRoller();
        }, 2500);
    },

    runBackground(){
        this.arrPositionWheel = [{'x':-427, 'y':-218}, {'x':-347, 'y':-218}, {'x':-267, 'y':-218}, {'x':-187, 'y':-218}, {'x':-107, 'y':-218}, {'x':-27, 'y':-218}, {'x':67, 'y':-218}, {'x':147, 'y':-218}, {'x':227, 'y':-218}, {'x':307, 'y':-218}, {'x':387, 'y':-218}, {'x':467, 'y':-218}, {'x':547, 'y':-218}, {'x':627, 'y':-218}];
        this.spawnNewWheel(this.arrPositionWheel);
        
    },

    startTimeRoller () {
        var times = 3; 
        this.schedule(()=> {    
            if (times !== 0) {
                if (!this.countDownNode) {
                    this.countDownNode = cc.instantiate(this.countDown);
                    this.node.addChild(this.countDownNode);
                }
                this.countDownNode.getChildByName("Sp Num").opacity = 255;
                this.countDownNode.getChildByName("Nodes start").opacity = 0;
                let spriteFrameName = "num_" + times;
                this.countDownNode.getChildByName("Sp Num").getComponent(cc.Sprite).spriteFrame = this.icon.getSpriteFrame(spriteFrameName);
                this.node.getComponent("SoundManager").playEffectSound("second", false);
            }   
            else {
                this.countDownNode.getChildByName("Sp Num").opacity = 0;
                this.countDownNode.getChildByName("Nodes start").opacity = 255;
                this.countDownNode.runAction(cc.fadeOut(1));
                this.node.getComponent("SoundManager").playEffectSound("begin", false);
                this.schedule(this.countDownScheduleCallBack, this.timeRollerStep);
                this.createChainProduct();
            }
            times--;
        }, 0.1, 3);  
    },

    countDownScheduleCallBack () {
        // if(this._nextLevel === true){
        //     this.timeRollerBar.fillStart += 1/200;
        // }       
        if(this._countProduct >= Level.level1 && this._countProduct < Level.level2){
            if(this._checkCovu1 === true){
                this._checkCovu1 = false;
                this.character.getComponent(cc.Animation).play('monsterIn');
                cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con làm tốt lắm,\ntiếp tục nào';
                this.node.getComponent("SoundManager").playEffectSound("tieptuc", false);   
                setTimeout(() => {
                    this.character.getComponent(cc.Animation).play('monsterOut');
                }, 2500);

                this._speed = Speed.speed2;
                this._duration = Duration.duration2;
                this._level = 2;  
                this._nextLevel = false;
                setTimeout(() => {
                    cc.find("Canvas/Background/LevelTable").getComponent(cc.Animation).play('levelTable');
                    cc.find("Canvas/Background/LevelTable/Level label").getComponent(cc.Label).string = 'Level 2';
                }, 3000); 
                setTimeout(() => {
                    this._nextLevel = true;
                    this.createChainProduct();
                }, 5000); 
            }
        }
        if(this._countProduct >= Level.level2 && this._countProduct < Level.level3){
            if(this._checkCovu2 === true){
                this._checkCovu2 = false;
                this.character.getComponent(cc.Animation).play('monsterIn');
                cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con làm tốt lắm,\ntiếp tục nào';
                this.node.getComponent("SoundManager").playEffectSound("tieptuc", false);   
                setTimeout(() => {
                    this.character.getComponent(cc.Animation).play('monsterOut');
                }, 2500);

                this._speed = Speed.speed3;
                this._duration = Duration.duration3;
                this._level = 3;
                this._nextLevel = false;
                setTimeout(() => {
                    cc.find("Canvas/Background/LevelTable").getComponent(cc.Animation).play('levelTable'); 
                    cc.find("Canvas/Background/LevelTable/Level label").getComponent(cc.Label).string = 'Level 3';
                }, 3000);
                setTimeout(() => {
                    this._nextLevel = true;
                    this.createChainProduct();
                }, 5000); 
            }
        }
        if (this._countProduct === Level.level3) {
            window._isGameOver = true;
            this.unschedule(this.countDownScheduleCallBack);
            if(window.scoreGlobal > 10){
                this._isWin = true;
            }else{
                this._isWin = false;
            }
            setTimeout(() => {
                this.onFinishGameEvent();
            }, 2500);
        }
    },

    createChainProduct(){
        this.schedule(()=> {  
            if (window._isGameOver === false && this._nextLevel === true) {
                this.spawnNewProduct();
                this._countProduct++;
            }
        }, this._duration, Level.level1);  
    },

    spawnNewProduct() {
        var newProduct = cc.instantiate(this.objectPrefab);
        this.node.addChild(newProduct);
        newProduct.setPosition(720, -100);
        cc.tween(newProduct)
            .to(this._speed, { position: cc.v2(-720, -100)})
            .start()
    },

    spawnNewWheel(arrPos) {
        var i = 0;
        while(arrPos[i] != null){
            var newWheel = cc.instantiate(this.wheelPrefab);
            this.node.addChild(newWheel);
            newWheel.setPosition(arrPos[i].x, arrPos[i].y);
            i++;
        } 
        
    },

    onFinishGameEvent(){
        cc.find("Canvas/Background").opacity = 200;
        cc.director.getCollisionManager().enabled = false;
        this.tableResult.getComponent(cc.Animation).play();
        this.scoreTable.string = "Score: " + window.scoreGlobal;
        this.character.getComponent(cc.Animation).play('monsterIn');
        if(this._isWin === true){
            cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Chúc mừng còn đã\nchiến thắng!';
            this.node.getComponent("SoundManager").playEffectSound("hoanthanh", false);   
            this.node.getComponent("SoundManager").playEffectSound("win", false);
        }else{
            cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con cần cố gắng\nhơn nữa nhé!';
            this.node.getComponent("SoundManager").playEffectSound("cancogang", false);   
            this.node.getComponent("SoundManager").playEffectSound("lose", false);
        }
        setTimeout(() => {
            this.character.getComponent(cc.Animation).play('monsterOut');
        }, 2500);
    },

    onClickBack(){
        // cc.director.loadScene("MainGame");
    },
    
    onClickReplay(){
        cc.director.loadScene("ChainProduct");
    },

    update (dt) {
        this.score.string = window.scoreGlobal;
    },
});
