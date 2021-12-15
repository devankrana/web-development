//---------question-------//
function outer(){
    let arr=[];
    for(var i=0;i<3;i++)
    {
        arr.push(function fn(){
            console.log(i);
        })
    }
    return arr;
}
let arr=outer();
arr[0]();
arr[1]();
arr[2]();
//output - 3,3,3

//------solution 1------------//
// function outer(){
//     let arr=[];
//     for(var i=0;i<3;i++)
//     {
//         arr.push(function fn(){
//             console.log(i);
//         }())
//     }
//     return arr;
// }
// let arr=outer();
//output--> 0,1,2

//------------solution 2-----------//
// function outer(){
//     let arr=[];
//     for(let i=0;i<3;i++)
//     {
//         function outer2(){
//             let j=i;
//             return (function fn(){
//                 console.log(j)
//             });
//         }
//         arr.push(outer2());
//     }
//     return arr;
// }
// let arrOut=outer();
// arrOut[0]();
// arrOut[1]();
// arrOut[2]();

//-----------solution 3-----------//

//use let instead of var while declaring i.