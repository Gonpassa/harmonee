const filledDays = document.querySelectorAll('.filled')
const modal = document.querySelector('.modal')

filledDays.forEach(day => {
    day.addEventListener('click', showModal)
})

function showModal(){
    document.querySelector('.modal').classList.toggle('hidden')
}

window.onclick = (e) => {
    if(e.target.classList.contains('modal')){
        modal.classList.toggle('hidden')
    }
}