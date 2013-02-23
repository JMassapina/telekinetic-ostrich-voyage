(function() {
    //
    // Components
    //
    Crafty.c('Ostrich', {
        init: function() {
            this.requires('2D, DOM, Color, Keyboard, Collision, Delay');
            this.color('#f00');
            this.attr({w: 100, h: 100, x: 400, y: 300});
            this.baseY = this.y;
            this.baseH = this.h;
            this.collision();
            this.bind('EnterFrame', function() {
                if (this.y < this.baseY) {
                    this.y = this.y + 5;
                }
            });
            this.bind('KeyDown', function(e) {
                if (e.key === Crafty.keys.SPACE) {
                    this.jump();
                }

                if (e.key === Crafty.keys.DOWN_ARROW) {
                    this.duck();    
                }
            });
            this.onHit('Obsticle', function() {
                this.destroy();
            });
        },
        jump: function() {
            this.y = this.baseY - 200;
        },
        duck: function() {
            this.h = this.h - 30;
            this.y = this.y + 30;
            this.delay(function() {
                this.h = this.baseH;
                this.y = this.y - 30;
            }, 1000);
        }
    });

    Crafty.c('Obsticle', {
        init: function() {
            this.requires('2D, DOM, Color, Delay, Collision');
            this.attr({w: 30, h: 30});
            this.collision();
            this.color('#0f0');
            this.bind('EnterFrame', function() {
                this.x = this.x - 10;
                if (this.x < 0) {
                    this.destroy();
                }
            });
        }
    });

    Crafty.c('Bush', {
        init: function() {
            this.requires('Obsticle');
            this.attr({x: 1024, y: 350});
        }
    });

    Crafty.c('Branch', {
        init: function() {
            this.requires('Obsticle');
            this.attr({x: 1024, y: 300});
        }
    });

    //
    // Game loading and initialisation
    //    
    var Game = function() {
        Crafty.scene('loading', this.loadingScene);
        Crafty.scene('main', this.mainScene);
    };
    
    Game.prototype.initCrafty = function() {
        console.log("page ready, starting CraftyJS");
        Crafty.init(1000, 600);
        Crafty.canvas.init();
        
        Crafty.modules({ 'crafty-debug-bar': 'release' }, function () {
            if (Crafty.debugBar) {
               Crafty.debugBar.show();
            }
        });
    };
    
    // A loading scene -- pull in all the slow things here and create sprites
    Game.prototype.loadingScene = function() {
        var loading = Crafty.e('2D, Canvas, Text, Delay');
        loading.attr({x: 512, y: 200, w: 100, h: 20});
        loading.text('loading...');
        
        function onLoaded() {
            
            // jump to the main scene in half a second
            loading.delay(function() {
                Crafty.scene('main');
            }, 500);
        }
        
        function onProgress(progress) {
            loading.text('loading... ' + progress.percent + '% complete');
        }
        
        function onError() {
            loading.text('could not load assets');
        }
        
        Crafty.load([
            // list of images to load
            'img/shooter-sprites.png'
        ], 
        onLoaded, onProgress, onError);
        
    };
    
    //
    // The main game scene
    //
    Game.prototype.mainScene = function() {
        Crafty.e('Ostrich');

        function createObsticle() {
            Crafty.e('Bush')
                .bind('Remove', function() {
                    Crafty.e('Branch')
                        .bind('Remove', createObsticle);
                });
        }

        createObsticle();
    };
        
    
    // kick off the game when the web page is ready
    $(document).ready(function() {
        var game = new Game();
        game.initCrafty();
        
        // start loading things
        Crafty.scene('loading');
    });
    
})();