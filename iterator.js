 function* toMatrix(arr, size){
   for(let i =0; i< arr.length;i+=size){
     yield arr.slice(i, i+size)
   }
  }
  
  function iteratorHelper  (iterator, callback){
    while(true){
    const result = iterator.next();
    if (result.done) break;
    callback && typeof callback == 'function' && callback(result.value);
   }
  }
  
   var iterator = toMatrix([1,2,3,4,5], 2);
   var onIterate = (value) => console.log(value);
   iteratorHelper(iterator, onIterate);
   
