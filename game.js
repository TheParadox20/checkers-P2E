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
                    direction:null,//null(unoccupied), 0(down), 1(up),2(top&down)
                    
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

    //identify CLICKS
    let clickActive = true;
    let turn = true;//true white(bottom), false black
    let lastClicked=[];
    let lastPath=[];
    canvas.addEventListener('click', function(event) {
        //helper functions
        let clearPath = ()=>{
            for(let i=0;i<lastPath.length;i++){
                let row = Math.floor(lastPath[i]/8);
                let col = lastPath[i]%8;
                context.fillStyle = board[row][col].colour;
                context.fillRect(board[row][col].x,board[row][col].y,cube,cube);
                if(board[row][col].occupied){
                    drawPiece(context, board[row][col].x+cube/2,board[row][col].y+cube/2,board[row][col].occupant==1?"#ff0000":"#ffff00")
                }
            }
        }

        let row = Math.floor(event.offsetY/cube);
        let col = Math.floor(event.offsetX/cube);
        //try a move
        if(lastPath.indexOf(board[row][col].id)>=0){//check if the clicked square is in the path
            //get colour of last clicked
            clearPath();
            context.fillStyle =board[row][col].colour;
            context.fillRect(board[row][col].x,board[row][col].y,cube,cube);
            drawPiece(context,board[row][col].x+cube/2,board[row][col].y+cube/2,lastClicked.occupant==1?"#ff0000":"#ffff00")
            //remove last clicked
            context.fillStyle = lastClicked.colour;
            context.fillRect(lastClicked.x,lastClicked.y,cube,cube);
            //update board
            board[row][col].occupied=true;
            let lastRow = Math.floor(lastClicked.id/8);
            let lastCol = lastClicked.id%8;
            board[lastRow][lastCol] = lastClicked;
            //update pieces
            pieces[row][col].occupant=pieces[lastRow][lastCol].occupant;
            pieces[row][col].direction=pieces[lastRow][lastCol].direction;
            lastClicked=[];
            lastPath=[];
            //update turn
            turn= !turn;
            return;
        }
        let verifyClick = ()=>{
            if(pieces[row][col].occupant==null || turn!=pieces[row][col].occupant) return false;
            clickActive=!clickActive;
            return true;
        };
        let predictPath = ()=>{
            let x = board[row][col].id;
            let diagonals = x%8==0||x%8==7?x%8==7?[x-9,x+7]:[x-7,x+9]:[(x-9),(x-7),(x+7),(x+9)];//note: not included top most and bottom most rows
            let path = pieces[row][col].direction!=0?diagonals.slice(0,diagonals.length/2):diagonals.slice(diagonals.length/2);
            //todo: validate path
            path.push(0);
            // console.log(path);
            path.forEach((step,index) => {//validating each step
                let row = Math.floor(step/8);
                let col = step%8;
                // console.log(index,'.)',step,row,col);
                console.log(step,board[row][col].occupied);
                if(board[row][col].occupied){
                    // path.splice(index,1);//remove step from path
                    // console.log(step,"occupied",path);
                }
            });
            path.pop();
            // console.log(path);
            //show paths by drawing circles
            //but first clear last paths
            if(lastPath!=[]){
                clearPath();
            }
            //then draw new paths
            for(let i=0;i<path.length;i++){
                let row = Math.floor(path[i]/8);
                let col = path[i]%8;
                drawPiece(context, board[row][col].x+cube/2,board[row][col].y+cube/2,"white")
            }
            lastPath = path;
        }

        if(verifyClick()){
            context.fillStyle = "green";
            context.fillRect(board[row][col].x,board[row][col].y,cube,cube);
            drawPiece(context,board[row][col].x+cube/2,board[row][col].y+cube/2,board[row][col].occupant==1?"#ff0000":"#ffff00")
            if(clickActive){
                context.fillStyle = lastClicked.colour;
                context.fillRect(lastClicked.x,lastClicked.y,cube,cube);
                drawPiece(context,lastClicked.x+cube/2,lastClicked.y+cube/2,lastClicked.occupant==1?"#ff0000":"#ffff00")                
            }
            if(lastClicked!=[]){
                context.fillStyle = lastClicked.colour;
                context.fillRect(lastClicked.x,lastClicked.y,cube,cube);
            }
            drawPiece(context,lastClicked.x+cube/2,lastClicked.y+cube/2,lastClicked.occupant==1?"#ff0000":"#ffff00");
            lastClicked = board[row][col];
            predictPath();
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
                pieces[i][j].direction=i>3?1:0;
                drawPiece(context,board[i][j].x+cube/2,board[i][j].y+cube/2,i>3?"#ff0000":"#ffff00")//black(bottom):white(top)
                board[i][j].occupant=i>3?1:0;
            }
        }
    }
}
// document.querySelector('#stats').innerHTML = `White: ${12} Brown: ${12}`
