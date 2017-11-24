
self.onmessage = function (event) {
    self.startQuickSort();
}


self.startQuickSort = function () {
    const LENGTH = 200;
    const MAX_VALUE = 2000;
    const arr = [...new Array(LENGTH)]
        .map(() => Math.round(Math.random() * MAX_VALUE));

    const result = self.quickSort(arr, 0, arr.length - 1);

    self.postMessage(result);
}

self.swap = function(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
 }
 
 self.partition = function (arr, pivot, left, right){
    var pivotValue = arr[pivot],
        partitionIndex = left;
 
    for(var i = left; i < right; i++){
     if(arr[i] < pivotValue){
       swap(arr, i, partitionIndex);
       partitionIndex++;
     }
   }
   swap(arr, right, partitionIndex);
   return partitionIndex;
 }
 
 self.quickSort = (arr, left, right) => {
    var len = arr.length,
    pivot,
    partitionIndex;
 
   if(left < right){
     pivot = right;
     partitionIndex = partition(arr, pivot, left, right);
 
    //sort left and right
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
   }
   return arr;
 }