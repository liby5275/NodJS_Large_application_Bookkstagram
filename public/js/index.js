const userJoinForm = document.querySelector('#userjoinform')

const userJoinFormButton = userJoinForm.querySelector('button')

userJoinForm.addEventListener('submit', (e) => {
    e.preventDefault()

    userJoinFormButton.setAttribute('disabled', 'disabled')

    const name = userJoinForm.querySelector('#name').value
    const genre = userJoinForm.querySelector('#genre').value
    const author = userJoinForm.querySelector('#author').value
    const book = userJoinForm.querySelector('#book').value
    window.location.href="main.html?name=" + name+'?genre='+genre+'?author='+author+'?book='+book;
})