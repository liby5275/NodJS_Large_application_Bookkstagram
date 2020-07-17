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
        window.location.href="main.html?name=" + name+'?password='+password;
    }

    
})

function register(){
    userJoinForm.style.display="none"
    userRegisterForm.style.display="block"
}

function login() {
    userJoinForm.style.display="block"
    userRegisterForm.style.display="none"
}

function proceedLogin(){
    userRegisterForm.querySelector('#registername').style.display="none"
    userRegisterForm.querySelector('#registerpassword').style.display="none"  
    userRegisterForm.querySelector('#proceedButton').style.display="none"
    userRegisterForm.querySelector('#confirmpassword').style.display="block"  
    userRegisterForm.querySelector('#confirmButton').style.display="block"      
}