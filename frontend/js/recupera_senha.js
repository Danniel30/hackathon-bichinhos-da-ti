const recupera = document.getElementById('enviar_btn');

function recuperar () {
   
    const email = document.getElementById('emaill').value;
    
    
    console.log(email)
    fetch('http://localhost:3000/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({ email })  
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao enviar E-mail de recuperação")
        }
        alert('Email enviado')
    })
    .catch(error => {
        console.error("Erro:", error)
        alert('Houve um erro ao enviar o email')
    })
}

    recupera.addEventListener('click', recuperar)