/*
    Title:      Scorched Earth HTML5 Game JavaScript
    File:       scorched_earth.js
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
    var gravity = 0.98;
    var fps = 1000 / 30; // 30fps
    var land = [];
    var tanks = [];
    var tank = {
        width: 15,
        height: 7
    };
    
    var count = 0;
    var colours = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 0, 255)'];
    
    return {        
        drawSky: function() {
            var bands = 30;
            
            // Set black background
            ctx.fillStyle  = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, width, height);
            
            // Vertical offset
            var v_offset = 100;
            
            var shade = Math.round(255 / bands);
            var band_height = Math.round((height - v_offset) / bands);
            var colour = 0;
            // Loop bands and adding them to the canvas
            for (var i=0; i<bands; i += 1) {
                ctx.fillStyle  = 'rgb(' + colour + ', 0, 0)';
                ctx.fillRect(0, v_offset + (band_height * i), width, band_height);
                colour += shade;
            }
        },
        
        drawLand: function() {
            // Clear land array
            land = [];
            
            // Bands count and colour shade
            var bands = 10;
            var shade = Math.round(150 / bands);
            
            // Random horizontal shift
            var hoz_shift = Math.round((Math.random() * width));
            
            // Loop through each pixel and draw the land
            for (var i=0; i < width; i += 1) {
                // Calculate Y position
                var shift = height/1.5;
                var amplitude = (height / 10);
                var frequency = Math.sin((i+hoz_shift)/100);
                var ypos = Math.round((frequency * amplitude) + shift);
                
                // Calculate band height
                var block_height = height-ypos;
                var band_height = (block_height / 3) / bands;
                
                // Set the colour of the ground
                ctx.fillStyle  = 'rgb(255, 255, 255)';
                
                var col = 255;
                var new_ypos = 0;
                
                // Draw bands on the block
                for (var n=0; n<bands; n += 1) {
                    ctx.fillStyle  = 'rgb(' + col + ',' + col + ',' + col +')';
                    
                    new_ypos = ypos + (band_height * n);
                    
                    // Draw the rectangle onto the canvas
                    ctx.fillRect(i, new_ypos, 1, band_height);
                    // Decrease colour by one shade
                    col -= shade;
                }
                
                ctx.fillStyle  = 'rgb(' + col + ',' + col + ',' + col +')';
                ctx.fillRect(i, new_ypos+band_height, 1, height-ypos);
                
                
                // Add land slice to array
                land.push({xpos: i, ypos: ypos});
            }
        },
        
        addTanks: function(num) {
            // Clear current tanks
            tanks = [];
            for (var i=0; i<num; i += 1) {                
                // Generate random X position
                var xpos = Math.round(Math.random() * width);
                
                ctx.fillStyle = colours[i];
                ctx.fillRect(xpos - tank.width/2, land[xpos].ypos - tank.height, tank.width, tank.height);
                
                // Store in tanks array
                tanks.push({xpos: xpos, ypos: land[xpos].ypos});
            }
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
            
            while (yPos <= land[Math.round(xPos)].ypos || xPos > width || xPos < 0 ) {
                ctx.beginPath();
                ctx.moveTo(xPos, yPos);
                xPos += xSpeed / 10;
                yPos -= ySpeed / 10;

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
                count += 1;
                d = new Date();
                now = d.getTime();
            }
            
            //setInterval(ScorchedEarth.outputFPS, fps)
        },
        
        outputFPS: function() {
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText('FPS: ' + count , count, count);
            count += 1;
        }
    };
})();

ScorchedEarth.drawSky();
ScorchedEarth.drawLand();
ScorchedEarth.addTanks(2);
ScorchedEarth.fireBullet(0, 50, 85);
ScorchedEarth.fireBullet(1, 60, 30);
//ScorchedEarth.outputFPS(23);
ScorchedEarth.animate();