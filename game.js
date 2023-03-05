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
    canvas.addEventListener('click', function(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        let row = Math.floor(y/cube);
        let col = Math.floor(x/cube);
        console.log(row,col)
        console.log(board[row][col])
        context.fillStyle = "green";
        context.fillRect(board[row][col].x,board[row][col].y,cube,cube);
    })

    //game logic
    /**
     * User must
     * 
    */
}

function initializeGame(context){
    let drawPiece = (x,y,colour)=>{
        let radius = cube/2
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
    //for the center of every cube draw a piece
    for(let i=0;i<Nrows;i++){
        if(i==3||i==4) continue
        for(let j=0;j<Ncol;j++){
            if(board[i][j].colour=="black"){
                board[i][j].occupied=true;
                drawPiece(board[i][j].x+cube/2,board[i][j].y+cube/2,i>3?"#ff0000":"#ffff00")//black(bottom):white(top)
                board[i][j].occupant=i>3?1:0;
            }
        }
    }
}
// document.querySelector('#stats').innerHTML = `White: ${12} Brown: ${12}`
