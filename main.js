// 定义棋盘大小：15*15
var ROWS = COLS = 15;

// 保存了每个棋子的引用，操作棋子以改变界面
var gridRefs = [];

var nextToPlace = 'black';

var finished = false;

//页面加载完毕后，调用initGrid创建棋盘
window.onload = initGrid;

//创建棋盘
function initGrid () {
  //此时页面可以保证已经加载完毕
  var gridElement = document.getElementById('grid');

  //一行一行创建棋盘
  for (var row = 0;row < ROWS;row++) {
    //创建一个数组，代表一行棋子
  var aRowOfPieces = [];
  gridRefs.push(aRowOfPieces); //gridRefs = [[]]

    for (var col = 0;col < COLS; col++){
      //创建新的棋子，放入棋盘
      var newPiece = document.createElement('i'); //<i></i>
      newPiece.classList.add('piece'); //<i class="piece"></i>
      gridElement.appendChild(newPiece); //<div id="grid"><i class="piece"></i></div>

      (function (irow, icol) {
        newPiece.addEventListener("click", function(){
          if (finished) return;

          placePiece(irow, icol, nextToPlace);

          /*
                      [row, col]
              左右     [0, -1]   [0, 1]
              上下     [-1, 0]   [1, 0]
              主对角线  [-1, -1]  [1, 1]
              副对角线  [-1, 1]   [1, -1]
          */

          var directions = [
            // 主方向      负方向
            [[0, -1],      [0, 1]],
            [[-1, 0],      [1, 0]],
            [[-1, -1],     [1, 1]],
            [[-1, 1],      [1, -1]]
          ]

          for (var i = 0; i < directions.length; i++) {
            var count = 1;
            var row = irow;
            var col = icol;
            var direction = directions[i]; //[[0, -1],[0, 1]]
            var state = 0; //0状态向主方向查找，1状态向负方向查找

            do {
              row += direction[state][0];
              col += direction[state][1];

              // count 等于5：胜利
              if (count===5) {
                win(nextToPlace)
                return
              }

              if (getPieceType(row, col) !== nextToPlace){
                if (state === 0) {
                  // 遇到不同色：切换到 state 1
                  state = 1;
                  row = irow;
                  col = icol
                } else if (state ===1) {
                  // 遇到不同色：胜利判断失败
                  console.log('没有获胜');
                  break
                }
              } else {
                // 遇到同色：count + 1
                count++
              }
            } while (true) //死循环
          }

          if(nextToPlace === 'black') {
            nextToPlace = 'white'
          } else if (nextToPlace === 'white') {
            nextToPlace = 'black'
          }
        })
      })(row, col);

      aRowOfPieces.push(newPiece) //gridRefs = [[1]]
    }
  }
}

//开始游戏
function startGame () {
  finished = false;
  nextToPlace = 'black';
  for (var row = 0;row < ROWS; row++) {
    for (var col = 0; col < COLS; col++) {
      gridRefs[row][col].classList.remove('piece--black', 'piece--white')
    }
  }
}

//可以在指定坐标落子 (三种类型：黑、白、空)
function placePiece (row, col, type) {
  var isNotEmpty = gridRefs[row][col].classList.contains('piece--black')||
                   gridRefs[row][col].classList.contains('piece--white');
  if (isNotEmpty) {
    throw new Error('Can not place two pieces in the same place')
  }
  if (row >14 || row < 0 || 
      col > 14 || col < 0) {
        throw new Error('beyond the grid');
      }
  if (type === 'black') {
    gridRefs[row][col].classList.add('piece--black');
  } else if (type === 'white') {
    gridRefs[row][col].classList.add('piece--white');
  } else {
    throw new Error('wrong piece class')
  }
}

// 返回指定坐标的棋子类型：黑，白，空
function getPieceType (row, col) {
  if (gridRefs[row][col].classList.contains('piece--black')) {
    return 'black'
  } else if (gridRefs[row][col].classList.contains('piece--white')) {
    return 'white'
  }
  return
}

function win(color) {
  finished = true;

  setTimeout(function() { //setTimeout是为了在页面刷新后、延迟执行
    alert(color + '胜利！')
  },0)
}