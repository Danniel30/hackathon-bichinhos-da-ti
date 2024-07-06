const registro = document.getElementById('registroo_btn');


function registrar () {
   
    const email = document.getElementById('emaiil').value;
    const tipo = document.getElementById('tipo').value;
    
    console.log('Email:', email);
    console.log('Tipo:', tipo);
    
    if (email !== '' && tipo !== '') {
        fetch('http://localhost:3000/inserir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({ email, tipo })  
        })
        .then(response => response.json())
        .then(dados=>{
            
            window.location.href = "/frontend/pages/mentor.html";
        })

    } 
    
    else {
        alert ('Preencha todos os campos')
    }
}

registro.addEventListener('click', registrar)