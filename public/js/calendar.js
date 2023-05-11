const filledDays = document.querySelectorAll('.filled')
const modal = document.querySelector('.modal')

filledDays.forEach(day => {
    day.addEventListener('click', showModal)
})

async function showModal(){
    const id = this.dataset.id
    try {
        const response = await fetch(`/journal/${id}`, {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'entryId': id
            })
        })
        const data = await response.json();
        const content = document.querySelector('.modal-content')
        content.innerHTML = `<h3>${data.title}</h3>
        <a href="/journal/${data._id}"> Edit </a>
        <i data-id="${id}" class="fa-solid fa-trash"></i>`
    } catch (err) {
        console.log(err);
    } 
    document.querySelector('.fa-trash').addEventListener('click', deleteEntry)
    document.querySelector('.modal').classList.toggle('hidden') 

}

async function deleteEntry(){
    const id = this.dataset.id
    try {
        const res = await fetch(`/journal/${id}`, {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'entryId': id,
            })
        })
        location.reload()
    } catch (err) {
        
    }
}
window.onclick = (e) => {
    if(e.target.classList.contains('modal')){
        modal.classList.toggle('hidden')
    }
}