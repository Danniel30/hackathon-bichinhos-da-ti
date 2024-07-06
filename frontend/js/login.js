const login = document.getElementById('login_btn');


function entrar () {
   
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const tipo = document.getElementById('tipoo').value;
    
    console.log('Email:', email)
    console.log('Senha:', senha)
    console.log('Tipo:', tipo)
    if (email !== '' && senha !== '' && tipo !=='') {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
        },
            body:JSON.stringify({ email, senha, tipo })  
        })
        .then(res => res.json())
        .then(dados=> {
            
            console.log("Resposta do servidor:" ,dados)
            
            if (dados.autorizado && tipo == "aluno") {
                window.location.href = "/frontend/pages/alunos.html";
            }
            else if (dados.autorizado && tipo == "mentor") {
                window.location.href = "/frontend/pages/mentor.html";
            }
            else {
                alert("Email ou senha incorretos")
            }
            
    })
    .catch (error => {
            console.error('Erro ao fazer login:', error)
            alert("Erro ao fazer o login. Tenten novamente mais tarde!")      
    
        })
    }
      
    else {
        alert ('Preencha todos os campos')
}   
}

login.addEventListener('click', entrar)