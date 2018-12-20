document.addEventListener('DOMContentLoaded', () => {

  //const noteId = document.querySelector('.note-id')
  const editForm = document.querySelector('.edit-form')
  editForm.addEventListener('submit', editingForm)
  editForm.style.display = 'none';

  const inputForm = document.querySelector('.input-form')
  inputForm.addEventListener('submit', creatingP)

  const edtBtn = document.querySelector('.edt-btn')
  const noteBody = document.querySelector('.note-body')
  const sideNav = document.querySelector('.sidenav')
  sideNav.addEventListener('click', showNote)
  noteBody.addEventListener('click', displayEditForm)

  // placeHolder()
  // function placeHolder(){
  //   const emptyWords = document.querySelector('.empty-words')
  //   if(noteBody.innerText === ''){
  //     noteBody.innerText = emptyWords
  //   }
  // }

   //const emptyWords = document.querySelector('.empty-words')
   //emptyWords.style.display = 'block'
  //if(noteBody.innerText === ''){
  //if(emptyWords.style.display = 'block'){
     // if(noteBody.innerText != ''){
     //   emptyWords.style.display = 'none'
     // }
    //emptyWords.style.display = 'block';
  //} //else {
  //   emptyWords.style.display = 'none';
  // }

  fetchingNotes()

  function fetchingNotes(){
    fetch('http://localhost:3000/api/v1/notes')
     .then(res => res.json())
     .then(addingNotesToSideBar)
  }

  function addingNotesToSideBar(notes){
    notes.forEach(note => {
      sideNav.innerHTML += `
        <p id="${note.id}" class="titles">${note.title}</p>
      `
    })
  }

  function creatingP(e){
    e.preventDefault()
    let newTitle = e.target.title.value
    let newBody = e.target.body.value

    fetch('http://localhost:3000/api/v1/notes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: newTitle,
        body: newBody,
        user: { "id": 1, "name": "flatironschool"}
      })
    })
    .then(res => res.json())
    .then(newP)
  }

  function newP(createdP){
    sideNav.innerHTML += `
      <p id="${createdP.id}" class="titles">${createdP.title}</p>
    `
    noteBody.innerHTML = `
    <h2 class="note-title">${createdP.title}</h2>
      <p class="body-of-note">${createdP.body}</p>
      <button id="${createdP.id}" class="edt-btn">Edit</button>
      <button id="${createdP.id}" class="dlt-btn">Delete</button>
    `
    inputForm.reset()
  }

  function showNote(e){
    if(e.target.className === 'titles'){

      editForm.style.display = 'none';
      inputForm.style.display = 'block';

      fetch(`http://localhost:3000/api/v1/notes/${e.target.id}`)
       .then(res => res.json())
       .then(noteToPage)
    }
  }

  function noteToPage(note){
    //emptyWords.style.display = 'none'
    noteBody.innerHTML = `
    <h2 class="note-title">${note.title}</h2>
      <p class="body-of-note">${note.body}</p>
      <button id="${note.id}" class="edt-btn">Edit</button>
      <button id="${note.id}" class="dlt-btn">Delete</button>
    `
  }

  function displayEditForm(e){
    // let title = document.querySelector('.note-title').innerText
    // let body = document.querySelector('.body-of-note').innerText
    // let noteId = parseInt(document.querySelector('.edt-btn').id)
    if(e.target.className === 'edt-btn'){
      let title = document.querySelector('.note-title').innerText
      let body = document.querySelector('.body-of-note').innerText
      let noteId = parseInt(document.querySelector('.edt-btn').id)
      
      inputForm.style.display = 'none';
      editForm.style.display = 'block';
      editForm.title.value = title
      editForm.body.value = body
      editForm.id.value = noteId
    }
    if(e.target.className === 'dlt-btn'){
      noteBody.innerText = ''
      //placeHolder()

      //let pageTags = e.target.parentElement.children
      // let innerPageTags = Array.from(pageTags)
      // innerPageTags.forEach(tag => {
      //   if(tag.tagName === 'H2'){
      //     tag.remove()
      //   } else if (tag.tagName === 'P'){
      //     tag.remove()
      //   } else if (tag.tagName === 'BUTTON'){
      //     tag.remove()
      //   } else if (tag.tagName === 'DIV'){
      //     noteBody.innerText = emptyWords;
      //   }
      // })
      //emptyWords.style.display = 'block'
      //debugger
      // debugger
      //   noteBody.innerHTML = emptyWords;

      //noteBody.innerText = emptyWords
      //emptyWords.style.display = 'block';

      let sidePs = sideNav.querySelectorAll('p')
      let arrPs = Array.from(sidePs)
      arrPs.forEach(p => {
        if(p.id === e.target.id){
          p.innerText = ''
        }
      })
      fetch(`http://localhost:3000/api/v1/notes/${e.target.id}`, {
        method: 'DELETE'
      })
    }
  }

  function editingForm(e){
    e.preventDefault()
    let theTitle = editForm.title.value
    let theBody = editForm.body.value
    fetch(`http://localhost:3000/api/v1/notes/${e.target.id.value}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: theTitle,
        body: theBody
      })
    })
     .then(res => res.json())
     .then(updatingNote)
  }

  function updatingNote(updatedNote){
    let sidePs = sideNav.querySelectorAll('p')
    let arrPs = Array.from(sidePs)
    arrPs.forEach(p => {
      if(parseInt(p.id) === updatedNote.id){
        p.innerText = updatedNote.title
      }
    })

    noteBody.innerHTML = `
    <h2 class="note-title">${updatedNote.title}</h2>
      <p class="body-of-note">${updatedNote.body}</p>
      <button id="${updatedNote.id}" class="edt-btn">Edit</button>
      <button id="${updatedNote.id}" class="dlt-btn">Delete</button>
    `
    editForm.reset()
    editForm.style.display = 'none';
    inputForm.style.display = 'block';
  }

})
