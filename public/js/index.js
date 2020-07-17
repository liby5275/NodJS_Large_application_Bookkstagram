const userJoinForm = document.querySelector('#userjoinform')
const userRegisterForm = document.querySelector('#userRegisterForm')

const userJoinFormButton = userJoinForm.querySelector('button')

userJoinForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const joinname = userJoinForm.querySelector('#joinname').value
    const password = userJoinForm.querySelector('#joinpassword').value

    if(password === "" && joinname.length>0){
        userJoinForm.querySelector('#joinname').style.display="none"
        userJoinForm.querySelector('#joinpassword').style.display="block"
        userJoinForm.querySelector('#nextButton').style.display="none"
        userJoinForm.querySelector('#joinButton').style.display="block"

    }else {
        userJoinFormButton.setAttribute('disabled', 'disabled')
        window.location.href="main.html?name=" + name+'?password='+password+'?type=existing';
    }

    
})


const proceedButton = userRegisterForm.querySelector('#proceedButton')
const confirmdButton = userRegisterForm.querySelector('#confirmButton')
const registerButton = userRegisterForm.querySelector('#registerButton')

proceedButton.addEventListener('click',e =>{

    e.preventDefault()
    userJoinForm.style.display="none"
    userRegisterForm.style.display="block"
    userRegisterForm.querySelector('#registername').style.display="none"
    userRegisterForm.querySelector('#registerpassword').style.display="none"  
    userRegisterForm.querySelector('#proceedButton').style.display="none"
    userRegisterForm.querySelector('#confirmpassword').style.display="block"  
    userRegisterForm.querySelector('#confirmButton').style.display="block"  
    
})

confirmdButton.addEventListener('click',e =>{
    e.preventDefault()
    var password = userRegisterForm.querySelector('#registerpassword').value;
    var confirmPwd = userRegisterForm.querySelector('#confirmpassword').value;

    if(password === confirmPwd){
        userRegisterForm.querySelector('#confirmpassword').style.display="none"  
        userRegisterForm.querySelector('#confirmButton').style.display="none"
        userRegisterForm.querySelector('#genre').style.display="block"  
        userRegisterForm.querySelector('#author').style.display="block"
        userRegisterForm.querySelector('#book').style.display="block"  
        userRegisterForm.querySelector('#registerButton').style.display="block"
    } else{
        alert('passwor does not match. please reenter');
        userJoinForm.style.display="none"
        userRegisterForm.style.display="block"
        
    }
})

registerButton.addEventListener('click',e=>{
        registerButton.setAttribute('disabled', 'disabled')
        var name = userRegisterForm.querySelector('#registername').value;
        var password = userRegisterForm.querySelector('#registerpassword').value;
        var genre = userRegisterForm.querySelector('#genre').value;
        var author = userRegisterForm.querySelector('#author').value;
        var book = userRegisterForm.querySelector('#book').value;
        window.location.href="main.html?name=" + name+'?password='+password+'?genre='+genre+'?author='+author+'?book='+book+'?type=new';
})

function register(){
    userJoinForm.style.display="none"
    userRegisterForm.style.display="block"
}

function login() {
    userJoinForm.style.display="block"
    userRegisterForm.style.display="none"
}



