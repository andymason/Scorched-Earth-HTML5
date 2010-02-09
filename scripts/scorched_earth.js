/*
    Title:      Scorched Earth HTML5 Game
    Description:
        A clone of the classic DOS game Scorched Earth, remade
        using JavaScript and HTML 5 <canvas> element.
        This is a personal project designed to learn more about
        JavaScript and HTML5
    
    Author:     Andrew Mason (andrew at coderonfire dot com)
    URL:        http://coderonfire.com/
    Version:    0.1
    Created:    09/02/2010
    
    License:
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
*/

var ScorchedEarth = (function() {
    // Private Vars
    var ctx = document.getElementById('game_board').getContext('2d');
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var gravity = 9.8 / 1;
    var fps = 1000 / 30; // 30fps
    var land = [];
    var tanks = [];
    var tank = {
        width: 15,
        height: 7
    }
    
    var count = 0;
    
    var colours = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 0, 255)'];

    ctx.fillStyle  = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    // Private
    function test() {
        alert('here');
    }
    
    return {
        method: function(msg) {
            alert(msg);
        },
        
        drawLand: function() {
            // Clear land array
            land = [];
            // Set the colour of the ground
            ctx.fillStyle  = 'rgb(255, 255, 255)';
            var hoz_shift = Math.round((Math.random() * width));
            // Loop through each pixel and draw the land
            for (var i=0; i < width; i++) {
                // Calculate Y position
                var shift = height/1.5;
                var amplitude = (height / 10);
                var frequency = Math.sin((i+hoz_shift)/100) 
                var ypos = Math.round((frequency * amplitude) + shift);
                
                // Draw the rectangle onto the canvas
                ctx.fillRect(i, ypos, 1, height-ypos);
                
                // Add land slice to array
                land.push({xpos: i, ypos: ypos});
            }
        },
        
        addTanks: function(num) {
            // Clear current tanks
            tanks = [];
            for (var i=0; i<num; i++) {                
                // Generate random X position
                var xpos = Math.round(Math.random() * width);
                
                ctx.fillStyle = colours[i];
                ctx.fillRect(xpos - tank.width/2, land[xpos].ypos - tank.height, tank.width, tank.height);
                
                // Store in tanks array
                tanks.push({xpos: xpos, ypos: land[xpos].ypos});
            }
            console.log(tanks);
        },
        
        fireBullet: function(tank_index, vol, ang) {
            var xPos = tanks[tank_index].xpos;
            var yPos = tanks[tank_index].ypos;
            var verlocity = vol;
            var angle = ang * (Math.PI / 180); // Convert to radians;
            var xSpeed = (Math.cos(angle) * verlocity); 
            var ySpeed = (Math.sin(angle) * verlocity);
            
            // Line Colour
            ctx.strokeStyle = colours[tank_index];
  
            
            for (var i=0; i < 100; i++) {
                ctx.beginPath();
                ctx.moveTo(xPos, yPos);
                xPos += xSpeed;
                yPos -= ySpeed;
                ctx.lineTo(xPos, yPos);
                ctx.closePath();
                ctx.stroke();
                
                ySpeed -= gravity;
            }
            
        },
        
        animate: function() {
            var d = new Date();
            var now = d.getTime();
            var end = now + fps;
            var count = 0;
            while (now < end) {
                count++;
                d = new Date();
                now = d.getTime();
            }
            console.log('count = %d', count);
            
            //setInterval(ScorchedEarth.outputFPS, fps)
        },
        
        outputFPS: function() {
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText('FPS: ' + count , count, count);
            count++;
        }
    }
})()

ScorchedEarth.drawLand();
ScorchedEarth.addTanks(2);
ScorchedEarth.fireBullet(0, 30, 50);
ScorchedEarth.fireBullet(1, 60, 30);
//ScorchedEarth.outputFPS(23);
ScorchedEarth.animate();