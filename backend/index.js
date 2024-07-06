// app.js (arquivo principal do backend)

const express = require("express")
const { Pool } = require("pg")
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express()
const cors = require('cors');
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


const port = 3000
require('dotenv').config()

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dbapi',
  password: 'postgres',
  port: 5432, // porta padrão do PostgreSQL
})

//const PORT = process.env.PORT || 3000;
pool.connect()
  .then(() => console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados PostgreSQL:', err))

  


app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`)
})

//Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
      user: 'bichinhos.da.ti@hotmail.com', // Seu email
      pass: '***********' // Sua senha
  }
});

//endpoints

// Rota para enviar o email
app.post('/send', (req, res) => { //funcionando
  const { email } = req.body;

  const mailOptions = {
      from: 'bichinhos.da.ti@hotmail.com',
      to: email,
      subject: 'Recuperação de senha',
      text: 'Segue o link abaixo para recuperação de sua senha:'
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          res.status(500).send('Erro ao enviar email');
      } else {
          console.log('Email enviado: ' + info.response);
          res.status(200).send('Email enviado com sucesso');
      }
  });
});

// Exemplo de end point para listar os alunos/professores
app.get('/list/users', async (req, res) => { //funcionando
  
  try {
      const { rows } = await pool.query('SELECT * FROM bichinhos.users')
      return res.status(200).json(rows)
  } catch (err) {
      console.error('Erro ao listar usuarios', err)
      return res.status(500).json({ error: 'Erro ao listar usuarios' })
  }
})

app.post('/inserir', async (req, res) => { //funcionando no front
  const {email, tipo} = req.body

  // Validações de entrada podem ser feitas aqui

  try {
      const query = await pool.query('INSERT INTO bichinhos.users (email, tipo) VALUES ($1, $2)',[email, tipo])
      return res.status(201).json({ message: 'Usuário registrado com sucesso' })
  } catch (err) {
      return res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
})



// Exemplo de endpoint para login sem token

app.post('/login', async (req, res) => { //não funcionando no front
  const { email, senha, tipo } = req.body

  try {
    const {rows}= await pool.query('SELECT * FROM bichinhos.users WHERE email = $1 AND senha = $2 AND tipo = $3',[email, senha, tipo])
      if (rows.length > 0) {
      // Usuário encontrado, gera token JWT ou retorna sucesso
      res.json({ autorizado: true })
    } else {
      // Usuário não encontrado
      res.json({ autorizado: false })
    }
  } catch (err) {
      return res.status(500).json({ error: 'Erro ao realizar login' })
  }
})


//security geração de token e verificação

const jwt = require('jsonwebtoken')

function verifyJWT(req,res,next) {
  const token = req.headers['x-access-token']
  jwt.verify(token, SECRET, (err, decoded) => {
    if(err) return res.status(401).end()
    
    req.userId = decoded.userId  
    next()
  })
}

app.get('/usuarios',verifyJWT,(req,res) => {
  console.log(req.userId  +  'fez esta chamada')
  res.status(201).json({ message: 'Usuário verificado'})

})

const SECRET = 'sua_chave_secreta_para_jwt'; // Deve ser mantida em segredo

// Exemplo de endpoint para login seguro 

app.post('/login/seguro', async (req, res) => { //funcionando
  const { email, senha, tipo } = req.body

  try {
    const {rows}= await pool.query('SELECT * FROM bichinhos.users WHERE email = $1 AND senha = $2 AND tipo = $3',[email, senha, tipo])
      if (rows.length > 0) {
      // Usuário encontrado, gera token JWT ou retorna sucesso
        const token = jwt.sign({userId: 1}, SECRET, {expiresIn: 300 })
        return res.status(200).json({auth: true, token})
    } else {
      // Usuário não encontrado
      return res.status(401).json({ error: 'Usuário não autorizado' })
    }
  } catch (err) {
      return res.status(500).json({ error: 'Erro ao realizar login' })
  }
})

app.post('/logout', function (req, res) { //funcionando
  return res.status(200).json({ message: 'Logout realizado com sucesso' })
})



// Exemplo de endpoint para alterar um registro

app.put('/alter/:id', async (req, res) => {  //funcionando
  const {id} = req.params
  const {email, tipo} = req.body

  try {
    const query = 'UPDATE bichinhos.users SET email = $1, tipo = $2 WHERE id= $3'
    const values = [email, tipo, id]
    const result = await pool.query (query, values)
    
    return res.status(201).send(req.body)
  } catch (error) {
    console.error('Erro ao atualizar registro:', error.message)
    return res.status(500).send('Erro ao processar a atualização')
  }
})
  
// Exemplo de endpoint para excluir um registro

app.delete('/delete/:id', async (req, res) => {  //funcionando
  const {id} = req.params
  
  try {
    const query = 'DELETE FROM bichinhos.users WHERE id= $1'
    const values = [id]
    const result = await pool.query (query, values)
    
    if (result.rowCount >0) {
      return res.status(200).send('Registro deletado com sucesso')
    } else {
      return res.status(404).send('Nenhum registro encontrado com esse id')
    }
      
  } catch (error) {
    console.error('Erro ao deletar registro:', error.message)
    return res.status(500).send('Erro ao processar a exclusão')
  }
})


