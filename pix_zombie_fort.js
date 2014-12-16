/*
 * Pixel Zombie Fort: front end code
 * written by Kevin Yang
 */
window.onfocus = function(){console.log("hi")}
 var createGrid = function(grdSize){
    var mousedown = false;
    // Creates new DIV
    var createTd = function(width, height){
        var active = false;
        var select = false;
        var newTd = document.createElement("td");
        newTd.style.width = width;
        newTd.style.height = height;
        newTd.style.position.left = "-1px";
        newTd.style.border = "1px red solid";
        newTd.onmouseover = function(){
            if(active == false){
                if(mousedown == true){
                    active = true;
                    drawPix(this, true, "blue");
                }
                else{
                    select = true;
                    drawPix(this, true, "red")};
                }
        }
        newTd.onmouseout = function(){
            if(active == false){
                /*
                if(mousedown == true){
                    active = true;
                    drawPix(this, true, "blue");
                }*/
                //else{
                    select = false;
                    drawPix(this, false);
                //}
            }
        }
        //mousedown in chrome cancels all other listeners
        newTd.onmousedown = function(){
            this.style.backgroundColor = "yellow";
            active = true;
            mousedown = true;
        }
        /*
        document.body.onmouseup = function(){
            mousedown = false;
        }
        document.getElementById("parDiv").onmouseout = function(){
            mousedown = false;
        }*/
        newTd.onmouseup = function(){
            //mousedown = false;
            this.style.backgroundColor = "green";
        }
        newTd.ondblclick = function(){
            this.style.backgroundColor = "grey";
            active = false;
        }
        return newTd;
    }
    var createTr = function(sqsz){
        var newTr = document.createElement("tr");
        newTr.className = "row";

        for(var j = 0; j < sqsz; j++){
        // show option of materials when double click
            newTr.appendChild(createTd("50px", "50px"));
        }
        return newTr;
    }

    var drawPix = function(that, isActive, color){
        if(isActive)
            that.style.backgroundColor = color;
        else
            that.style.backgroundColor = "white";
    }
    
    var populateGrid = function(grdsz){
        var parentDiv = document.createElement("table");
        parentDiv.style.width = 52*grdsz + 11 + "px";
        parentDiv.style.height = 52*grdsz+ 11 + "px";
        parentDiv.style.border = "1px green solid";
        parentDiv.id = "parDiv";
        for(var i = 0; i < grdsz; i++){
            parentDiv.appendChild(createTr(grdsz));
        }
        parentDiv.onmouseup = function(){
            mousedown = false;
        }/*
        parentDiv.onmouseout = function(){
            mousedown = false;
        }*/
        return parentDiv;
    }
    // Populate parent div to form grid
    document.getElementsByTagName("body")[0].appendChild(populateGrid(grdSize));
 }