/*
 * Pixel Avatar Maker: front end code
 * written by Kevin Yang
 */

 var createGrid = function(grdSize){
    var mousedown = false;
    // Creates new DIV
    var createDiv = function(sqsz){
        var newDiv = document.createElement("div");
        var active = false;
        var select = false;
        newDiv.className = "meow";
        newDiv.style.width = "50px";
        newDiv.style.height = "50px";
        newDiv.style.position.left = "-1px";
        newDiv.style.border = "1px red solid";
        // show option of materials when double click
        newDiv.onmouseenter = function(){
            if(active == false){
                select = true;
                drawPix(this, true, "red")};
        }
        newDiv.onmouseout = function(){
            if(active == false){
                if(mousedown == true){
                    drawPix(this, true, "blue");
                }
                else{
                    select = false;
                    drawPix(this, false);
                }
            }
        }
        newDiv.onmousedown = function(){
            this.style.backgroundColor = "yellow";
            active = true;
            mousedown = true;
        }
        newDiv.onmouseup = function(){
            this.style.backgroundColor = "green";
            mousedown = false;
        }
        newDiv.ondblclick = function(){
            this.style.backgroundColor = "grey";
            active = false;
        }
        return newDiv;
    }

    var drawPix = function(that, isActive, color){
        if(isActive)
            that.style.backgroundColor = color;
        else
            that.style.backgroundColor = "white";
    }
    
    var populateGrid = function(grdsz){
        var parentDiv = document.createElement("div");
        parentDiv.style.width = 52*grdsz + 11 + "px";
        parentDiv.style.height = 52*grdsz+ 11 + "px";
        parentDiv.style.border = "1px green solid";
        for(var i = 0; i < grdsz*grdsz; i++){
            parentDiv.appendChild(createDiv());
        }
        return parentDiv;
    }
    // Populate parent div to form grid
    document.getElementsByTagName("body")[0].appendChild(populateGrid(grdSize));
 }