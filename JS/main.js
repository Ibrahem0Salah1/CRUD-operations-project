let title = document.getElementById('title');
let costInputs=document.querySelectorAll("#costInputs input");
let countOfItems = document.getElementById('count');
let dept = document.getElementById('Department');
let tableRow=document.querySelector('#tbody');
let sendBtn=document.querySelector('#createbtn');
let clearAllBtn=document.querySelector('#clearAll');
let countElment=document.querySelector('#countElment');
let inputs=document.querySelectorAll("input");
console.log(inputs);
let validationStatus=false;
let checkValidation =() => {
    for(let i=0;i<inputs.length;i++){
        if(inputs[i].value ==""){
            validationStatus=false;
        } else{
            validationStatus=true; 
        }
}
}

let checkValidationCostInputs =() => {
    for(let i=0;i<costInputs.length;i++){
        if(costInputs[i].value <=0){
            validationStatus=false;
        } else{
            validationStatus=true; 
        }
}
}


// let removeOneItem=document.querySelector('#del');
// let editItem=document.querySelector('#edit');
//the list of objects
let date= new Date();
let allData;
if(localStorage.products ==null) {
    allData=[];
} else{
    allData=JSON.parse(localStorage.products);
}
let mood="create";
let globalID;
// GET TOTAL PRICE FUNCTION
let getTotalPrice=() => {
    let price=costInputs[0].value;
    let tax=costInputs[1].value;
    let delivary=costInputs[2].value;
    let discount=costInputs[3].value;

    let result=0;
    result+=+price;
    result+= price*(+tax/100);
    result+=+delivary;
    result-=+discount;
    costInputs[4].value=Math.ceil(result);
}
// KEYUP THE PRICE INTO screen
for(let i=0;i<costInputs.length;i++){
    costInputs[i].addEventListener('keyup',getTotalPrice);
}
//create function that creates the object
let createProductOject=()=>{
    let newProduct={
        year:date.getFullYear(),
        month:date.getMonth()+1,
        day:date.getUTCDate()+1,
        hour:date.getHours()-12,
        min:date.getMinutes(),
        sec:date.getSeconds(),
        title: title.value,
        price:costInputs[0].value,
        tax:costInputs[1].value,
        delivary:costInputs[2].value,
        discount:costInputs[3].value,
        total : costInputs[4].value,
        count: count.value,
        department: dept.value
    }
    checkValidation();
    checkValidationCostInputs();
    // let id=0;
    // tableRow.innerHTML=`
    //     <td>${++id}</td>
    //     <td>${newProduct.title}</td>
    //     <td>${newProduct.price}</td>
    //     <td>${newProduct.tax}</td>
    //     <td>${newProduct.delivary}</td>
    //     <td>${newProduct.discount}</td>
    //     <td>${newProduct.total}</td>
    //     <td>${newProduct.department}</td>
    // `;
    if(validationStatus==true){
        if(mood=="create"){
            if( newProduct.count>= 1){
                for(let i=1;i<=newProduct.count;i++){
                    allData.push(newProduct);
                    clearInputs();
                } 
            } else{
                allData.push(newProduct);
                
                clearInputs();
            }
        } else{
            allData[globalID]=newProduct;
            mood='create';
            sendBtn.innerHTML="Create New Product";
            sendBtn.classList.remove("editt");
            count.classList.remove("none");
            clearInputs();
        }
        localStorage.setItem("products",JSON.stringify(allData));
        showData();
        clearInputs();
    }
   
    // let reset=()=> {
    //     this.title="";
    //     this.price="";
    //     this.tax="";
    //     this.delivary="";
    //     this.discount="";
    //     this.total="";
    //     this.count="";
    //     this.department="";
    // }
    
}
//push data into array
sendBtn.addEventListener('click',createProductOject);


// function that clears inputs after sending data
let clearInputs=()=>{
    title.value="";
    costInputs[0].value="";
    costInputs[1].value="";
    costInputs[2].value="";
    costInputs[3].value="";
    costInputs[4].value="";
    count.value="";
}


// check to clear all data button
let checkClearedAllData=()=>{
    if(allData.length>0){
        clearAllBtn.classList.remove("none");
    } else{
        clearAllBtn.classList.add("none"); 
    }
}



// shows data into table
let showData=() => {
    checkClearedAllData();
    
    let trs="";
    for(let i=0;i<allData.length;i++){
        trs+=`
        <tr>
            <td>${i+1}</td>
            <td>${allData[i].title}</td>
            <td>${allData[i].price}</td>
            <td>${allData[i].tax}</td>
            <td>${allData[i].delivary}</td>
            <td>${allData[i].discount}</td>
            <td>${allData[i].total}</td>
            <td>${allData[i].department}</td>
            <td >${allData[i].day}/${allData[i].month}/${allData[i].year}
                <br>
                ${allData[i].hour}:${allData[i].min}:${allData[i].sec}
            </td>

            <td colspan="2">
                <i onclick="removeOneItem(${i})" id="del" class="fa-solid fa-trash"></i>
                <i onclick="editOneItem(${i})" id="edit" class="fa-solid fa-pen"></i>
            </td>
        </tr>
    `;

    }
    tableRow.innerHTML=trs;
    countElment.innerHTML=allData.length;
}
showData();

// clear all data function
let clearAll =()=>{
    if(window.confirm("are you sure?")){
        localStorage.clear();
        allData.splice(0);
        showData();
        checkClearedAllData();
    } else{
        showData();
    }
    
}

clearAllBtn.addEventListener('click', clearAll);


// function that removes one item
let removeOneItem =(i)=>{
    if(window.confirm("are you sure?")){
        allData.splice(i,1);
        localStorage.products=JSON.stringify(allData);
        
    }
    showData();
}


// function that edits one item

let editOneItem = (i) =>{
    mood="update";
    title.value=allData[i].title;
    costInputs[0].value=allData[i].price;
    costInputs[1].value=allData[i].tax;
    costInputs[2].value=allData[i].delivary;
    costInputs[3].value=allData[i].discount;
    costInputs[4].value=allData[i].total;
    dept.value=allData[i].department;
    globalID=i;
    sendBtn.innerHTML=`update product ${i+1}`;
    sendBtn.classList.add("editt");
    count.classList.add("none");
}