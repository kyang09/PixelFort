function Zombie(_id, _x, _y, _direction, div, horde) {
    var self = this;

    this.direction = _direction;
    this.id = _id;
    this.pos = { x: _x, y: _y };
    this.anim = horde.animWalk;
    this.animFrame = 0;
    this.animDelta = 0;
    this.speed = 30;
    this.state = horde.stateWalking;
    this.corpseDelta = 0;
    this.horde = horde;

    div.onclick = function () {
        return function () {
            self.ZombieClick();
        }
    }();
}

Zombie.prototype.Update = function (delta) {
    if (this.state == this.horde.stateDead)
        return;

    //update the animation frame
    this.animDelta += delta;
    if (this.animDelta >= this.anim.speed) {
        this.animDelta -= this.anim.speed;
        this.animFrame++;
        if (this.animFrame >= this.anim.numFrames)
            this.animFrame = 0;
    }

    //background-position-x
    var div = document.getElementById(this.id);
    div.style.backgroundPositionX = ((this.horde.spritesheetWidth - (this.horde.spriteWidth * this.anim.frames[this.animFrame])) - this.horde.spriteOffsetX) + "px";
    div.style.backgroundPositionY = ((this.horde.spriteHeight * this.direction) - this.horde.spriteOffsetY) + "px";

    if (this.state == this.horde.stateWalking) {
        //update position
        if (this.direction == this.horde.directionEast)
            this.pos.x += (this.speed * delta);
        if (this.direction == this.horde.directionWest)
            this.pos.x -= (this.speed * delta);
        if (this.direction == this.horde.directionNorth)
            this.pos.y -= (this.speed * delta);
        if (this.direction == this.horde.directionSouth)
            this.pos.y += (this.speed * delta);
        div.style.left = Math.floor(this.pos.x) + "px";
        div.style.top = Math.floor(this.pos.y) + "px";
    }
    else if (this.state == this.horde.stateDying && this.animFrame == (this.anim.numFrames - 1)) {
        this.state = this.horde.stateDead;
    }
}

Zombie.prototype.ZombieClick = function (div) {
    if (this.state == this.horde.stateWalking) {
        this.state = this.horde.stateDying;
        this.animFrame = 0;
        this.animDelta = 0;
        this.anim = this.horde.animDying;
    }
}

function ZombieHorde()
{
    this.zombies = [];
    this.nextZombieID = 0;
    this.spawnRate = 1;
    this.spawnDelta = 0;
    this.corpseDuration = 3;
    this.LastUpdate = Date.now();

    this.directionWest = 0;
    this.directionNorth = 6;
    this.directionEast = 4;
    this.directionSouth = 2;

    this.stateWalking = 0;
    this.stateDying = 1;
    this.stateDead = 2;

    this.animWalk = {
        speed: 0.15,
        numFrames: 8,
        frames: [4, 5, 6, 7, 8, 9, 10, 11]
    }

    this.animDying = {
        speed: 0.10,
        numFrames: 8,
        frames: [28, 29, 30, 31, 32, 33, 34, 35]
    }

    this.spriteWidth = 128;
    this.spriteHeight = 128;

    this.spriteOffsetX = 25;
    this.spriteOffsetY = 25;

    this.spritesheetWidth = 4608;
}

ZombieHorde.prototype.NewZombie = function ()
{
    var x = 0;
    var y = 0;
    var direction = 0;

    var rand = Math.random();
    if (rand < 0.25)
    {
        //spawn from left of screen
        x = this.spriteWidth * -1;
        y = (Math.random() * screen.height) - this.spriteHeight;
        direction = this.directionEast;
    }
    else if (rand < 0.5) {
        //spawn from right of screen
        x = screen.width;
        y = (Math.random() * screen.height) - this.spriteHeight;
        direction = this.directionWest;
    }
    else if (rand < 0.75) {
        //spawn from top of screen
        x = (Math.random() * screen.width) - this.spriteWidth;
        y = this.spriteWidth * -1;
        direction = this.directionSouth;
    }
    else {
        //spawn from bottom
        x = (Math.random() * screen.width) - this.spriteWidth;
        y = screen.height;
        direction = this.directionNorth;
    }

    //generate an id
    var id = 'zombie' + this.nextZombieID;
    this.nextZombieID++;

    //create a div
    var div = document.createElement("div");
    div.id = id;

    div.style.width = "78px";
    div.style.height = "78px";
    div.style.backgroundImage = "url('zombie.png')";
    div.style.backgroundPosition = "left";
    div.style.backgroundPositionX = "0px";
    div.style.backgroundPositionY = "0px";
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.zIndex = "100";

    div.className = "zombie";

    document.body.appendChild(div);

    //create a zombie
    this.zombies.push(new Zombie(id, x, y, direction, div, this));
}

ZombieHorde.prototype.SpawnZombies = function(delta)
{
    this.spawnDelta += delta;
    if (this.spawnDelta >= this.spawnRate) {
        this.spawnDelta -= this.spawnRate;
        this.NewZombie();
    }
}

ZombieHorde.prototype.CleanupZombies = function(delta)
{
    for (var i = this.zombies.length - 1; i >= 0 ; i--) {
        //if the zombie has walked off the screen, remove them
        if (this.zombies[i].pos.x < (this.spriteWidth * -2)
            || this.zombies[i].pos.x > screen.width + this.spriteWidth
            || this.zombies[i].pos.y < (this.spriteHeight * -2)
            || this.zombies[i].pos.y > screen.height + this.spriteHeight)
        {
            var element = document.getElementById(this.zombies[i].id);
            element.parentNode.removeChild(element);
            this.zombies.splice(i, 1);
        }

    }

    for (var i = this.zombies.length - 1; i >= 0 ; i--) {
        //if the zombie has died, remove their corpse after some time
        if (this.zombies[i].state == this.stateDead) {
            this.zombies[i].corpseDelta += delta;

            if (this.zombies[i].corpseDelta > this.corpseDuration || this.CancelHorde) {
                var element = document.getElementById(this.zombies[i].id);
                element.parentNode.removeChild(element);
                this.zombies.splice(i, 1);
            }
        }
    }

}

ZombieHorde.prototype.Update = function () {
    var self = zombieHorde;
    var now = Date.now();
    var delta = now - self.LastUpdate;
        
    self.CleanupZombies(delta / 1000);

    if (!self.CancelHorde)
        self.SpawnZombies(delta / 1000);

    for (var i in self.zombies)
        self.zombies[i].Update(delta / 1000);

    self.LastUpdate = now;

    if (!self.CancelHorde || self.zombies.length)
        setTimeout(self.Update, 30);
}

ZombieHorde.prototype.StartHorde = function()
{
    this.CancelHorde = false;
    this.LastUpdate = Date.now();
    setTimeout(this.Update, 30);
}

ZombieHorde.prototype.StopHorde = function () {

    //kill off all zombies
    for (var i = this.zombies.length - 1; i >= 0 ; i--) {
        this.zombies[i].state = this.stateDying;
        this.zombies[i].animFrame = 0;
        this.zombies[i].animDelta = 0;
        this.zombies[i].anim = this.animDying;
    }

    this.CancelHorde = true;
}

zombieHorde = new ZombieHorde();