/*
 * Pixel Zombie Fort: front end code
 * written by Kevin Yang
 */

//window.onfocus = function(){console.log("hi")}
var createGrid = function(grdSize) {
    var mousedown = false;
    // Creates new DIV
    var createTd = function(width, height) {
        var active = false;
        var select = false;
        var newTd = document.createElement("td");
        newTd.style.width = width;
        newTd.style.height = height;
        newTd.style.position.left = "-1px";
        newTd.style.border = "1px red solid";
        newTd.onmouseover = function() {
            if (active == false) {
                if (mousedown == true) {
                    active = true;
                    drawPix(this, true, "blue");
                } else {
                    select = true;
                    drawPix(this, true, "red")
                };
            }
        }
        newTd.onmouseout = function() {
                if (active == false) {
                    /*
                    if(mousedown == true){
                        active = true;
                        drawPix(this, true, "blue");
                    } else{ */
                    select = false;
                    drawPix(this, false);
                    //}
                }
            }
            //mousedown in chrome cancels all other listeners
        newTd.onmousedown = function() {
            this.style.backgroundColor = "yellow";
            active = true;
            mousedown = true;
        }
        newTd.onmouseup = function() {
            //mousedown = false;
            this.style.backgroundColor = "green";
        }
        newTd.ondblclick = function() {
            this.style.backgroundColor = "grey";
            active = false;
        }
        return newTd;
    }
    var createTr = function(sqsz) {
        var newTr = document.createElement("tr");
        newTr.className = "row";

        for (var j = 0; j < sqsz; j++) {
            // show option of materials when double click
            newTr.appendChild(createTd("50px", "50px"));
        }
        return newTr;
    }

    var drawPix = function(that, isActive, color) {
        if (isActive)
            that.style.backgroundColor = color;
        else
            that.style.backgroundColor = "white";
    }

    // Populate the grid and do stuff within the grid
    var populateGrid = function(grdsz) {
            var parentDiv = document.createElement("table");
            parentDiv.style.width = 52 * grdsz + 11 + "px";
            parentDiv.style.height = 52 * grdsz + 11 + "px";
            parentDiv.style.border = "1px green solid";
            parentDiv.id = "parDiv";
            for (var i = 0; i < grdsz; i++) {
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
            // Zombie object for health, position, view and death
            var Zombie = function(type, row, column) {
                this.health;
                this.row = row;
                this.column = column;
                this.view = {
                    "left": undefined,
                    "front": undefined,
                    "right": undefined,
                };
                if (type == "easy") {
                    this.health = 1;
                } else if (type == "normal") {
                    this.health = 2;
                } else if (type == "hard") {
                    this.health = 3;
                }
            }

            var zombie = new Zombie("easy", 0, 0);

            var animateGrid = function(row, column, time, direction, steps, cursteps) {
                if (row < 0 || column < 0) {
                    //end = new Date().getMilliseconds();
                    //diff = end - start;
                    console.log("Cannot move up/left !!!");
                    return parentDiv.rows[row + 1].cells[column];
                } else if (row == parentDiv.rows.length || column == parentDiv.rows[row].cells.length) {
                    console.log("cannot move down/right !!!");
                    return parentDiv.rows[row - 1].cells[column];
                } else if (row == parentDiv.rows.length) {
                    //end = new Date().getMilliseconds();
                    //diff = end - start;
                    return parentDiv.rows[row - 1].cells[column];
                } else if (cursteps == steps) {
                    if (row == 0)
                        return parentDiv.rows[row].cells[column - 1];
                    else if (column == 0)
                        return parentDiv.rows[row - 1].cells[column];
                    else
                        return parentDiv.rows[row - 1].cells[column - 1];
                } else {
                    setTimeout(function() {
                        parentDiv.rows[row].cells[column].style.backgroundColor = "purple";
                        setTimeout(function() {parentDiv.rows[row].cells[column].style.backgroundColor = "white";}, 280);
                        zombie.row = row;
                        zombie.column = column;
                        console.log(zombie);
                    }, time + 100); // 100 here is initial delay before any animation, not speed of animation bet. frames.

                    /* Btw, if direction is negative, direction % 8 returns negatuve.
                     * This is because it is accepted for C programmers, back then.
                     * Search up how to correctly return negative modulus equation if needed.
                     * I'm taking advantage of the negative value for catching client direction error.
                
                     * I'm enforcing that only >= 0 numbers are used.

                     * I will test when animating:
                     *   - Is incrementing the direction variable faster longrun?
                         - Or is reassigning direction variable better?

                     * For now, I will allow any >= 0 number for direction
                     * since my modulus will calculate the case number.

                     * Maybe iterative is more efficient.....
                    */
                    switch (direction % 8) {
                        case 0:
                            return animateGrid(row - 1, column, time + 300, direction, steps, ++cursteps);
                            break;
                        case 1:
                            if (column + 1 > parentDiv.rows[row].cells.length)
                                console.log("Cannot move more right!!!");
                            else
                                return animateGrid(row - 1, column + 1, time + 300, direction, steps, ++cursteps);
                            break;
                        case 2:
                            return animateGrid(row, column + 1, time + 300, direction, steps, ++cursteps);
                            break;
                        case 3:
                            return animateGrid(row + 1, column + 1, time + 300, direction, steps, ++cursteps);
                            break;
                        case 4:
                            return animateGrid(row + 1, column, time + 300, direction, steps, ++cursteps);
                            break;
                        case 5:
                            return animateGrid(row + 1, column - 1, time + 300, direction, steps, ++cursteps);
                            break;
                        case 6:
                            return animateGrid(row, column - 1, time + 300, direction, steps, ++cursteps);
                            break;
                        case 7:
                            return animateGrid(row - 1, column - 1, time + 300, direction, steps, ++cursteps);
                            break;
                        default:
                            console.log("Invalid Direction!");
                    }
                    /*
                                    if(direction == 0 && row >= 0){
                                        if(row - 1 < 0){
                                            console.log("Cannot move more up!!!");
                                        }
                                        return animateGrid(row - 1, column, time + 100, direction, steps, ++cursteps);
                                    }
                                    else if(direction == 1){
                                        return animateGrid(row - 1, column + 1, time + 100, direction, steps, ++cursteps);
                                    }
                                    else if(direction == 2){
                                        return animateGrid(row, column + 1, time + 100, direction, steps, ++cursteps);
                                    }
                                    else if(direction == 3){
                                        return animateGrid(row + 1, column + 1, time + 100, direction, steps, ++cursteps);
                                    }
                                    else if (direction == 4){
                                        return animateGrid(row + 1, column, time + 100, direction, steps, ++cursteps);
                                    }
                                    else if(){

                                    }*/
                }
            }

            // 4th parameter 0 1 2 3 (up, left, right, down)
            zombie.row = 3;
            zombie.column = 3;
            //var test = animateGrid(zombie.row, zombie.column, 0, 2, 4, 0);
            //console.log(test);
            
            for(var i = 0; i < 8; i++){
                console.log(animateGrid(zombie.row, zombie.column, 0, i, grdsz-1, 0));
            }

            /* Animate zombies by using a while loop kinda like
             * while (zombie.health !== 0){
                  animateGrid(...); // Recursive call eachtime with some path to animate
               }
            */
            // Makes sure with the mouse is up, stop drawing.
            parentDiv.onmouseup = function() {
                    mousedown = false;
            }
            /*
            parentDiv.onmouseout = function(){
                mousedown = false;
            }*/
            return parentDiv;
        }
    // Populate parent div to form grid
    document.getElementsByTagName("body")[0].appendChild(populateGrid(grdSize));
}