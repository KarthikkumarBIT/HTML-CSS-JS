// const api_key="CG-gpPfzJDT24iqpdQrQ1WYq51d";
// const url="api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd&x_cg_demo_api_key=";

// async function crypto_data(){
//     try{
//         const response=await fetch("https://"+url+api_key);
//         const data=await response.json();
//         console.log(data);
//         document.querySelector("#coin-value1").innerHTML='$'+data.bitcoin.usd;
//         document.querySelector("#coin-value2").innerHTML='$'+data.ethereum.usd;
//         document.querySelector("#coin-value3").innerHTML='$'+data.dogecoin.usd;
//     }
//     catch(err){
//         console.log("Sorry please try again after some time.");
//         document.querySelector("#coin-value1").innerHTML="------";
//         document.querySelector("#coin-value2").innerHTML="------";
//         document.querySelector("#coin-value3").innerHTML="------";
//     }
// }
// crypto_data();

// setInterval(crypto_data,60000);

const val1 = document.querySelector("#coin-value1");
const val2 = document.querySelector("#coin-value2");
const val3 = document.querySelector("#coin-value3");

const socket = new WebSocket("wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/dogeusdt@trade");

socket.onmessage = (msg) => {
  const payload = JSON.parse(msg.data);
  const stream = payload.stream;
  const price = '$'+parseFloat(payload.data.p).toFixed(2);
  // console.log(payload);

  if (stream === "btcusdt@trade"){
    if(price!=val1.textContent) {
      val1.innerHTML = price;
    }
  }else if (stream === "ethusdt@trade") {
    if(price!=val2.textContent) {
      val2.innerHTML = price;
    }
  }else if (stream === "dogeusdt@trade") {
    if(price!=val3.textContent) {
      val3.innerHTML = price;
    }
  }
};

socket.onerror=(error)=>{
  console.error(error);
}

window.addEventListener("beforeunload", () => {
  socket.close();
});