const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const form = document.getElementById('loginForm');
form.addEventListener('submit',async(evt)=>{
    evt.preventDefault();
    let data = new FormData(form);
    let obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('api/sessions/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>result.json())
    .then(json=>console.log(json))
    await sleep(900)
    window.location.href = "https://ecommerce-production-0be9.up.railway.app/"
});

