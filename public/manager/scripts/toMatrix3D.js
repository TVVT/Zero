var result = [];
var m = new Array(4),
    mc;
for (var i = 0; i < 4; i++) {
    m[i] = new Array(4);
    for (var j = 0; j < 4; j++) {
        m[i][j] = 0;
    }
}
m[0][0] = m[1][1] = m[2][2] = m[3][3] = 1;
var perspectiveM = deepCopy(m),
    scaleM = deepCopy(m),
    translateM = deepCopy(m),
    rotateX = deepCopy(m),
    rotateY = deepCopy(m),
    rotateZ = deepCopy(m);

var toMatrix3D = function(matrix) {
    var result = new Array(4),
        resultArray = [];
    for (var i = 0; i < 4; i++) {
        result[i] = new Array(4);
        for (var j = 0; j < 4; j++) {
            result[i][j] = 0;
        }
    }
    //设置透视矩阵
    perspectiveM[2][3] = (-1 / matrix.perspective);
    //设置形变矩阵
    scaleM[0][0] = matrix.scaleX;
    scaleM[1][1] = matrix.scaleY;
    scaleM[2][2] = matrix.scaleZ;
    //设置位移矩阵
    translateM[3][0] = matrix.translateX;
    translateM[3][1] = matrix.translateY;
    translateM[3][2] = matrix.translateZ;
    //设置x旋转矩阵
    rotateX[1][1] = Math.cos(toDegree(matrix.rotateX));
    rotateX[1][2] = Math.sin(-toDegree(matrix.rotateX));
    rotateX[2][1] = Math.sin(toDegree(matrix.rotateX));
    rotateX[2][2] = Math.cos(toDegree(matrix.rotateX));
    //设置y旋转矩阵
    rotateY[0][0] = Math.cos(toDegree(matrix.rotateY));
    rotateY[0][2] = Math.sin(toDegree(matrix.rotateY));
    rotateY[2][0] = Math.sin(-toDegree(matrix.rotateY));
    rotateY[2][2] = Math.cos(toDegree(matrix.rotateY));
    //设置z旋转矩阵
    rotateZ[0][0] = Math.cos(toDegree(matrix.rotateZ));
    rotateZ[0][1] = Math.sin(-toDegree(matrix.rotateZ));
    rotateZ[1][0] = Math.sin(toDegree(matrix.rotateZ));
    rotateZ[1][1] = Math.cos(toDegree(matrix.rotateZ));
    //计算
    // result = matrixMultipy(perspectiveM,scaleM);

    result = matrixMultipy(translateM, scaleM);
    result = matrixMultipy(result, rotateZ);
    result = matrixMultipy(result, rotateY);
    result = matrixMultipy(result, rotateX);
    result = matrixMultipy(result, perspectiveM);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            resultArray.push(result[i][j]);
        }
    }

    return resultArray.join(",");
}

//计算角度->弧度

    function toDegree(d) {
        return (2 * Math.PI / 360) * d;
    }


    //deepCopy

    function deepCopy(arr) {
        if (arr[0][0] === undefined) {
            throw new Error('Input cannot be a vector.');
        }

        var result = new Array(arr.length);

        for (var i = 0; i < arr.length; i++) {
            result[i] = arr[i].slice();
        }

        return result;
    }

    //列与行的乘法相加

    function dotproduct(vectorA, vectorB) {
        if (vectorA.length === vectorB.length) {
            var result = 0;
            for (var i = 0; i < vectorA.length; i++) {
                result += vectorA[i] * vectorB[i];
            }
            return result;
        } else {
            throw new Error("Vector mismatch");
        }
    };

//求矩阵的秩

function matrixTranspose(arr) {
    var result = new Array(arr[0].length);
    for (var i = 0; i < arr[0].length; i++) {
        result[i] = new Array(arr.length);
        for (var j = 0; j < arr.length; j++) {
            result[i][j] = arr[j][i];
        }
    }
    return result;
}
//矩阵相乘法

function matrixMultipy(arrA, arrB) {
    if (arrA[0].length === arrB.length) {
        var result = new Array(arrA.length);

        for (var x = 0; x < arrA.length; x++) {
            result[x] = new Array(arrB[0].length);
        }
        var arrB_T = matrixTranspose(arrB);
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = dotproduct(arrA[i], arrB_T[j]);
            }
        }
        return result;
    } else {
        throw new Error("Array mismatch");
    }
}
