window.onload=()=>{
const data=JSON.parse(localStorage.getItem("cartItems"));
    if(Array.isArray(data)){
        for(let item of data){
            addItemsToCart(item.name,item.price);
        }
    }
}

let cart={
    Items:[],

    get subTotal() {
        return this.Items.reduce((sum, item) => sum + item.price, 0);
    },
    get discount(){
        return this.subTotal*0.1;
    },
    get tax(){
        return (this.subTotal-this.discount)*0.05;
    },
    get total(){
        return this.subTotal-this.discount+this.tax;
    },

    *[Symbol.iterator](){
        for(let i=0;i<this.Items.length;i++){
            yield `Item ${i+1}: ${this.Items[i].name} - ₹${this.Items[i].price.toFixed(2)}`;
        }
    }
}

cart.Items = new Proxy(cart.Items,{
    set(target,prop,value){
        const result=Reflect.set(target,prop,value);
        if(!isNaN(prop)){ 
            updateTable(value);
            updateTotal();
            updateReceipt();
        }
        return result;
    }
});

function addItemsToCart(name,price){
    cart.Items.push({name,price});
    localStorage.setItem("cartItems", JSON.stringify(cart.Items));
}

function updateTable(item){
    const tbody=document.querySelector(".tableBody");
    const row=document.createElement("tr");
    row.innerHTML=`<td>${cart.Items.length}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>`;
    tbody.appendChild(row);
}

function updateTotal(){
    document.getElementById("subtotal").textContent = cart.subTotal.toFixed(2);
    document.getElementById("discount").textContent = cart.discount.toFixed(2);
    document.getElementById("tax").textContent = cart.tax.toFixed(2);
    document.getElementById("total").textContent = cart.total.toFixed(2);
}

function updateReceipt(){
    const receipt=document.getElementById("receiptLog");
    receipt.innerHTML='';
    for(let item of cart){
        const ele=document.createElement("p");
        ele.innerHTML=item;
        receipt.appendChild(ele);
    }
    const totalAmt = document.createElement("p");
    totalAmt.innerHTML = `<strong>Total: ₹${cart.total.toFixed(2)}</strong>`;
    receipt.appendChild(totalAmt);
}

document.querySelector("#cartReceipt details").addEventListener('toggle',function(){
    if(this.open)
        updateReceipt();
});

const addBtn=document.querySelector("#addBtn");

addBtn.addEventListener('click',(e)=>{
    const price=parseFloat(document.querySelector("#itemPrice").value);
    const name=document.querySelector("#itemName").value;
    if(name==''){
        alert("Item name cannot be Empty");
        return;
    }
    if(price=='' || isNaN(price) || price<1){
        alert("Enter price atleast rupees 1");
    }
    else{
        addItemsToCart(name,price);
        alert("Item added to the cart successfully.");
        document.querySelector("form").reset();
    }
});
