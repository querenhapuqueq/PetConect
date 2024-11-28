const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializando o Express
const app = express();
const port = 3000;

// Configuração do banco de dados SQLite com Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // O SQLite irá armazenar o banco de dados no arquivo `database.sqlite`
});

// Definindo o modelo de Usuário
const Usuario = sequelize.define('Usuario', {
  nome: DataTypes.STRING,
  cpf: DataTypes.STRING,
  email: DataTypes.STRING,
  telefone: DataTypes.STRING,
  cep: DataTypes.STRING,
  endereco: DataTypes.STRING,
  numeroCasa: DataTypes.STRING,
  senha: DataTypes.STRING,
  confirmarSenha: DataTypes.STRING,
}, {
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha !== usuario.confirmarSenha) {
        throw new Error("As senhas não coincidem.");
      }
      usuario.senha = await bcrypt.hash(usuario.senha, 10);
    },
    beforeUpdate: async (usuario) => {
      if (usuario.senha !== usuario.confirmarSenha) {
        throw new Error("As senhas não coincidem.");
      }
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
  },
});

Usuario.prototype.compararSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

// Definindo o modelo de Pet com relação ao usuário
const Pet = sequelize.define('Pet', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  genero: {
    type: DataTypes.ENUM('Macho', 'Fêmea'),
    allowNull: false,
  }
});

// Relacionamento entre Usuário e Pet (um usuário pode ter vários pets)
Usuario.hasMany(Pet, { foreignKey: 'usuarioId' });
Pet.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Configurando o Express para usar JSON
app.use(bodyParser.json());

// Configuração do CORS (permissões de acesso)
const corsOptions = {
  origin: '*',  // Permite todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));  // Permite CORS

// Rota para registrar um novo usuário com seus pets
app.post('/api/cadastrar', async (req, res) => {
  const { nome, cpf, email, telefone, cep, endereco, numeroCasa, senha, confirmarSenha, pets } = req.body;

  try {
    console.log('Cadastro de novo usuário:', req.body);  // Log para depuração
    const novoUsuario = await Usuario.create({
      nome,
      cpf,
      email,
      telefone,
      cep,
      endereco,
      numeroCasa,
      senha,
      confirmarSenha,
    });

    if (pets && pets.length > 0) {
      const promessasPets = pets.map(pet => {
        return Pet.create({
          ...pet,
          usuarioId: novoUsuario.id  // Relacionando o pet com o usuário
        });
      });

      await Promise.all(promessasPets);
    }

    res.status(201).json({ mensagem: "Usuário e pets cadastrados com sucesso", usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(400).json({ erro: error.message });
  }
});

// Rota para login de usuário
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    console.log('Tentando login para o email:', email);  // Log para depuração

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    const isPasswordValid = await usuario.compararSenha(senha);
    if (!isPasswordValid) {
      return res.status(400).json({ erro: 'Senha inválida' });
    }

    res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario });
  } catch (error) {
    res.status(500).json({ erro: 'Erro no servidor', detalhes: error.message });
  }
});

// Iniciando o servidor e conectando ao banco de dados SQLite
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('Erro ao conectar com o banco de dados:', err);
  });
