const login=document.getElementById('submit-btn');

function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

let current_captcha=generateCaptcha();
document.getElementById("captcha-box").textContent=current_captcha;

document.getElementById("btn-refresh").addEventListener("click", () => {
        current_captcha = generateCaptcha();
        document.getElementById("captcha-box").textContent = current_captcha;
        document.getElementById("cap-inc").style.display = "none";
        document.getElementById("captcha-input").value = "";
});

login.addEventListener('click',(event)=>{
    event.preventDefault();

    const email=document.getElementById("name");

    const pass=document.getElementById("password");
    const password=pass.value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    
    function isValidEmail(eid) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(eid);
    }

    if(isValidEmail(email.value)){
        document.getElementById('inc-email').style.display="none";
        email.style.border="1px solid green";
        pass.focus();
    }
    else{
        document.getElementById("inc-email").style.display="block";
        email.style.border="1px solid red";
        email.focus();
        return;
    }

    if(passwordPattern.test(password)){
        document.getElementById('inc-pass').style.display="none";
        pass.style.border="1px solid green";
        document.getElementById("captcha-input").focus();
    }
    else{
        document.getElementById('inc-pass').style.display="block";
        pass.style.border="1px solid red";
        pass.focus();
        return;
    }

    const captchaInput = document.getElementById("captcha-input").value;

    if (captchaInput !== current_captcha) {
        document.getElementById("cap-inc").style.display = "block";
        document.getElementById("captcha-input").style.border = "1px solid red";
        document.getElementById("captcha-input").focus();
        return;
    } else {
        document.getElementById("cap-inc").style.display = "none";
        document.getElementById("captcha-input").style.border = "1px solid green";
    }

    let form=document.getElementById("login-form");
    let data=new FormData(form);
    let name=data.get("email");
    localStorage.setItem("user", JSON.stringify({
        email: name,
        loggedIn: true
        }));
    window.location.replace("http://127.0.0.1:5500/home.html");
})