var board = ["","","",
               "","","",
               "","",""]; // the gameboard
var player;
var computer;
var winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var weHaveAWinner = false;
var winner = "";
var totalMoves = 0;

function displayBoard(){
  for (var i = 0; i<9; i++){
    $('#cell'+i).html(board[i]);
  }
  checkWinner();
}

function playerMove(){
  if (player === undefined || weHaveAWinner) return;
  cell = $(this).attr('id').slice(-1);

  if (board[cell] === "") {
    board[cell] = player;
    displayBoard();
    totalMoves++;
    computerMove();
  }
}

function calculateMove(){
  var corners = [0,2,6,8]; 
  var sides = [1,3,5,7];
  var center = 4
  if (totalMoves === 0){ // board is empty
    return corners[Math.floor(Math.random()*4)]; // starting in corner is best tactic
  } 
  if (totalMoves === 1){ // first move, but player already moved
    if (corners.includes(board.indexOf(player))){ // player in corner
      return center;
    } 
    if (center = board.indexOf(player)) { // player in center
      return corners[Math.floor(Math.random()*4)];
    } else { // player must be at side.
      if (board.indexOf(player)==1 || board.indexOf(player) == 3) {
        return 0; // put it in a corner next to the players sign
      } else {
        return 8;
      }
    }
  }
  if (totalMoves === 2){
    if (corners.includes(board.indexOf(player))) { // player also in corner
      var c = board.indexOf(computer);
      var p = board.indexOf(player);
      return corners.filter(function(){return !c && !p})[0]; //another corner
    } else if (board.indexOf(player)=== center) { // player in center
      var c = board.indexOf(computer);
      switch (c) {
        case 0:
          return 8;
        case 2:
          return 6;
        case 6:
      	  return 2;
        case 8:
          return 0;
        } // opposite corner
    } else { // player on edge
      return center;      
    }
  }
  if (totalMoves === 3){
    
  }
  for (var i=0; i<winningLines.length;i++){ // check if player or computer has two in same line with empty third spot.
    var a = board[winningLines[i][0]];
    var b = board[winningLines[i][1]];
    var c = board[winningLines[i][2]];
    var sorted = [a,b,c].sort();
    if (sorted[0]==="" && sorted[1] === computer && sorted[2]===computer) { // computer has two in same line and can win.
      if (a === "") return winningLines[i][0];
      if (b === "") return winningLines[i][1];
      if (c === "") return winningLines[i][2];
    }
  }
  for (var i=0; i<winningLines.length;i++){ // check if player or computer has two in same line with empty third spot.
    var a = board[winningLines[i][0]];
    var b = board[winningLines[i][1]];
    var c = board[winningLines[i][2]];
    var sorted = [a,b,c].sort();
    if (sorted[0]==="" && sorted[1] === player && sorted[2] === player) { // player has two in same line, must put own sign in third position 
      if (a === "") return winningLines[i][0];
      if (b === "") return winningLines[i][1];
      if (c === "") return winningLines[i][2];
    } else if (sorted[0] !== "" && totalMoves === 3) { // 3 in a row, one of them comp.
      if (board[center]===player){
        console.log(winningLines[i][0],winningLines[i][2])
        return corners.filter(function(val){return val!==winningLines[i][0] && val!==winningLines[i][2]})[0]; // another corner
      } else {
        return sides[Math.floor(Math.random()*4)];
      }
      
    }
  }
  var e = Math.floor(Math.random()*9);
  while (board[e] !== "") {
    e = Math.floor(Math.random()*9);
  }
  return e;
}

function computerMove(){
  if (!weHaveAWinner){
    var move = calculateMove();
    console.log(move);
    board[move] = computer;
    $('#cell'+move).addClass('taken');
    displayBoard();
    totalMoves++;
  }
}

function checkWinner(){
  for (var i=0; i<winningLines.length; i++){
    if (board[winningLines[i][0]] !== "" && board[winningLines[i][0]] === board[winningLines[i][1]] && board[winningLines[i][0]] === board[winningLines[i][2]]) { // three X's or O's in a row.
      if (board[winningLines[i][0]] === player) {
        weHaveAWinner = true;
        winner = "You won!";
        $('#cell'+winningLines[i][0]).addClass('winningLine');
        $('#cell'+winningLines[i][1]).addClass('winningLine');
        $('#cell'+winningLines[i][2]).addClass('winningLine');
      } else {
        weHaveAWinner = true;
        winner = "You lost!";
        $('#cell'+winningLines[i][0]).addClass('winningLine');
        $('#cell'+winningLines[i][1]).addClass('winningLine');
        $('#cell'+winningLines[i][2]).addClass('winningLine');
      }
    }
  }
  if (!weHaveAWinner && board.indexOf("") === -1){
    weHaveAWinner = true;
    winner = "Draw!"
  } 
  if (weHaveAWinner) {
    $('#message').html("<p>" + winner + "</p>");
    $('.overlay').show();
  }
}

$(document).ready(function(){
  $('.overlay').hide(0);
  $('#reset').hide(0);
  displayBoard();
  
 
  $('#xmarksthespot,#ohnoyoudidnt').on('click',function(){
    player = $(this).html();
    computer = player === "X" ? "O" : "X"; // the other one.
    $('.choice').fadeOut(400);
    $('#reset').fadeIn(400);
    if (computer === "X"){
      computerMove();
    }
  });
    
  $('.cell').on('click',playerMove);
  
  $('#reset').on('click', function(){
    $('.choice').fadeIn(400);
    $('#reset').fadeOut(400);
    computer = "";
    player = "";
    board = ["","","","","","","","",""];
    displayBoard();
    $('.overlay').hide();
    weHaveAWinner = false;
    winner = "";
    totalMoves = 0;
    $('.cell').removeClass('winningLine');
  });
    
});