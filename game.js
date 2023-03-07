let board = []
let pieces = []
//board specs
let Nrows = 8;
let Ncol = 8;
let boardSide = 400;
let startingX=0;
let startingY=0;
let cube = boardSide/Nrows; // side of smalll cube

export function setupCanvas(element){
    let canvas = element;
    canvas.width=boardSide;
    canvas.height=boardSide;
    let context = canvas.getContext('2d');
    //create board
    let colour = false;
    for(let i=0;i<Nrows;i++){
        board.push([])
        pieces.push([])
        for(let j=0;j<Ncol;j++){
            board[i].push(
                {
                    id:i*Nrows+j,
                    x:startingX,
                    y:startingY,
                    occupied:false,
                    colour:colour?"black":"grey"
                }
            );
            pieces[i].push(
                {
                    occupant:null,//null(unoccupied), 0(white), 1(black)`
                    
                }
            );
            context.fillStyle = colour?"black":"grey";
            context.fillRect(startingX,startingY,cube,cube);
            colour=!colour;
            startingX+=cube;
        }
        startingY+=cube;
        startingX=0;
        colour=!colour;
    }
    startingX=0;startingY=0
    //insert pieces
    initializeGame(context)

    //identify clicks
    let clickActive = true;
    let lastClicked;
    let turn = 0;
    canvas.addEventListener('click', function(event) {
        let row = Math.floor(event.offsetY/cube);
        let col = Math.floor(event.offsetX/cube);
        let verifyClick = ()=>{
            if(pieces[row][col].occupant==null || turn!=pieces[row][col].occupant) return false;
            clickActive=!clickActive;
            console.log('Inner',clickActive)
            return true;
        };
        console.log(pieces[row][col])
        console.log(verifyClick())
        if(verifyClick()){
            context.fillStyle = "green";
            context.fillRect(board[row][col].x,board[row][col].y,cube,cube);
            drawPiece(context,board[row][col].x+cube/2,board[row][col].y+cube/2,board[row][col].occupant==1?"#ff0000":"#ffff00")
            if(clickActive){
                console.log("first click",clickActive)
                context.fillStyle = lastClicked.colour;
                context.fillRect(lastClicked.x,lastClicked.y,cube,cube);
                drawPiece(context,lastClicked.x+cube/2,lastClicked.y+cube/2,lastClicked.occupant==1?"#ff0000":"#ffff00")                
            }
            context.fillStyle = lastClicked.colour;
            context.fillRect(lastClicked.x,lastClicked.y,cube,cube);
            drawPiece(context,lastClicked.x+cube/2,lastClicked.y+cube/2,lastClicked.occupant==1?"#ff0000":"#ffff00")
            lastClicked = board[row][col]
        }else{
            console.log("not a valid click")
        }
    })

    //game logic
    /**
     * User must
     * 
    */
}
function drawPiece(context,x,y,colour){
    let radius = cube/3
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = colour;
    context.fill();
    context.closePath();
    
    // Draw the outline of the checker piece
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    context.stroke();
    context.closePath();
}
function initializeGame(context){
    //for the center of every cube draw a piece
    for(let i=0;i<Nrows;i++){
        if(i==3||i==4) continue
        for(let j=0;j<Ncol;j++){
            if(board[i][j].colour=="black"){
                board[i][j].occupied=true;
                pieces[i][j].occupant=i>3?1:0;
                drawPiece(context,board[i][j].x+cube/2,board[i][j].y+cube/2,i>3?"#ff0000":"#ffff00")//black(bottom):white(top)
                board[i][j].occupant=i>3?1:0;
            }
        }
    }
}
// document.querySelector('#stats').innerHTML = `White: ${12} Brown: ${12}`
