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
    
    // Populate the grid and do stuff within the grid
    var populateGrid = function(grdsz){
        var parentDiv = document.createElement("table");
        parentDiv.style.width = 52*grdsz + 11 + "px";
        parentDiv.style.height = 52*grdsz+ 11 + "px";
        parentDiv.style.border = "1px green solid";
        parentDiv.id = "parDiv";
        for(var i = 0; i < grdsz; i++){
            parentDiv.appendChild(createTr(grdsz));
        }
        //console.log(parentDiv.rows[0].cells[0]);
        var time = 1000;
        /*
        var start = new Date().getTime();
        var end;
        for(var i = 0, row; row = parentDiv.rows[i]; i++){
            for(var j = 0, col; col = row.cells[j]; j++){
                //var col = row.cells[0];
                // Sends copy of col to anonymous func to setTimeout.
                // Without this, each setTimeout function will not have individual var access
                (function(c, t){setTimeout(function(){c.style.backgroundColor = "purple"},t);})(col, time);

                // Time is adding by a constant to set speed. Multiplying will have a parabolic speed upwards.
                time = time + 200;
            }
        }
        end = new Date().getTime();
        console.log(end - start);
    */

        // Recursive solution to animating through a grid.
        // Moves diagnally. Iterative might be better.
        var start = new Date().getMilliseconds();
        var end;
        var diff = 0;

        // If doing ++row or ++column in recursion, js seems to create local
        // and skip on square ahead. Pass in row/ column by doing like row + 1
        /* One not so elegant solution to it skipping over one square is:
         * Use a --row when accessing array, the ++row in recursive return parameter.
         * Kinda like this:
         *  setTimeout(function(){
            parentDiv.rows[--row].cells[--column].style.backgroundColor = "purple";
            }, time + 100);
            return animateGrid(++row, ++column, time + 100, direction, steps);
        */
        var animateGrid = function(row, column, time, direction, steps){
            //console.log(steps + " " + column);
            if(row < 0 || row == parentDiv.rows.length){
                                        //console.log(row);
                end = new Date().getMilliseconds();
                diff = end - start;
                return;
            }
            else if((column || row) == steps){
                return;
            }
            else if(column == parentDiv.rows[row].cells.length - 1){
                return animateGrid(++row, -1, time, direction, steps);
            }
            else{
                if(direction == 0 && row >= 0){
                    setTimeout(function(){
                        console.log(row);
                        row = row + 1;
                    parentDiv.rows[row].cells[column].style.backgroundColor = "purple";
                    }, time + 100);
                    row = row - 1;
                    if(row < 0){
                        console.log("Cannot move more up!!!");
                    }
                    console.log(row);
                    return animateGrid(row, column, time + 100, direction, steps);
                }
                else if(direction == 1){
                    setTimeout(function(){
                    parentDiv.rows[row].cells[column].style.backgroundColor = "purple";
                    }, time + 100);
                    //++column;
                    return animateGrid(row, column + 1, time + 100, direction, steps);
                }
                else if(direction == 2){
                    setTimeout(function(){
                    parentDiv.rows[row].cells[column].style.backgroundColor = "purple";
                    }, time + 100);
                    return animateGrid(row + 1, column + 1, time + 100, direction, steps);
                }
                else{
                    setTimeout(function(){
                    parentDiv.rows[row].cells[column].style.backgroundColor = "purple";
                    }, time + 100);
                    return animateGrid(row + 1, column, time + 100, direction, steps);
                }
            }
        }

        // 4th parameter 0 1 2 3 (up, left, right, down)
        animateGrid(0,0, 0, 3, 3);
        //animateGrid(0,-1, 0, false, 5);
        // Makes sure with the mouse is up, stop drawing.
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