import express from 'express';
// importei as funcionalidades do framework para a constante express
import { StatusCodes } from 'http-status-codes';

const app = express();
// estou passando para a constant app a function express
app.use(express.json());
// definindo que todos os requests vão estar sendo enviados objetos no formato json

const PORT = process.env.PORT || 3000;
//primeiro vai tentar pegar o valor da const pela variável de ambiente. Caso não consiga, vai ser 3000
//estou colocando o numero da porta utilizada numa constante adequada para tal

let users = [
  { id: 1, name: 'Caique Sacramento', age: 47 },
  { id: 2, name: 'Murilo Silva', age: 47 },
  { id: 3, name: 'Zayn Sacramento', age: 15 },
  { id: 4, name: 'Zoey Sacramento', age: 13 }
];

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// estou usando um método do express chamado listen, que recebe dois parametros, a porta e uma função de callback (função a ser executada após o fim do request do listen)

app.get('/', (request, response) => {
  return response.send('<h1> Trabalhando com servidor express.</h1>');
});
// método get, recebe a rota, e depois uma callback function com request e response
// o send e uma funcionalidade de dentro do response
//lembrando que tanto o nome request, quanto o response que estao dentro dos parametros sao nomes facultativos, eles representam isso, mas podemos utilizar quaisquer nomes. No exemplo da documentacao do node ele estava chamando de req, res. Mas o comportamento que esse parametro vai ter ja e previamente definido.

app.get('/users', (request, response) => {
  return response.send(users);
});
//o :userId é a forma de passar uma variável para a rota
app.get('/users/:userId', (request, response) => {
  const userId = request.params.userId;
  // estou atribuindo ` constante userId o valor do argumento que esta vindo no parametro da rota atraves da request cujo nome está definido na linha 33 como userId
  const user = users.find(user => {
    return (user.id === Number(userId))
  })
  return response.send(user);
});

//o metodo find parece o metodo filter, porem, o filter vai filtrar varios elementos de uma lista com base em uma condicao, ja o find vai retornar o primeiro elemento que atender determinada condicao, como o id e unico para cada elemento, ele cabe perfeitamente para ser utilizado na situacao acima

app.post('/users', (request, response) => {
  const newUser = request.body;
  users.push(newUser);

  return response.status(StatusCodes.CREATED).send(newUser);
});
// não é uma boa prática utilizar o status assim na mão
// utilizaremos a dependencia http-status-codes (instalando através do npm install)

app.put('/users/:userId', (request, response) => {
  const userId = request.params.userId;
  //apenas relembrando que esse primeiro parâmetro do put e de todos os verbos se trata da rota, ou seja, o endereço que vai ser dado o request
  // o userId está recebendo o que foi passado depois do /users/, pois estou colocando isso como um parâmetro chamado userId
  const updatedUser = request.body;
  // o updatedUser vai ser o conteúdo do body que está sendo passado através de uma request

  users = users.map(user => {
    if (Number(userId) === user.id) {
      return updatedUser;
    }
    return user;
  });
  // esse users é a variável users que contém um string com 4 objetos na linha 13, e ele está recebendo um map de si próprio
  //nesse map, o user antes da arrow está recebendo cada objeto do array, e pra cada iteração referente a cada objeto dentro do array,
  //será executado o trecho do código que está dentro das chaves
  //a condição é que se o userId que vai o route param passado na request for igual ao atributo id do objeto que estiver sendo varrido
  //esse objeto vai receber o valor da constante updatedUser, que está armazenando o valor passado pelo body por request
  //caso não seja, vai returnar o seu próprio valor. Ou seja, isso vai repetir todo o array, com exceção do id que passarmos por parâmetro, que, por sua vez, vai ser atualizado.

  return response.send(updatedUser);
});

app.delete('/users/:userId', (request, response) => {
  const userId = request.params.userId;
  users = users.filter((user) => user.id !== Number(userId));

  return response.status(StatusCodes.NO_CONTENT).send();

});
// metodo delete de dentro do express() que está na constante app sendo chamado com os parâmetros da rota e de uma callback function com req e res
// a const userId recebe o valor passado pelo parametro que esta na rota :userId, lembrando que os dois pontos são apenas para referenciar que se trata de um parametro quando o colocamos na rota
// o array com objetos que esta na variavel users recebe o metodo filter que, por sua vez, ira receber dois parametros, um com o novo array formado,
// e outro com as condicoes para ele retornar os elementos no novo array (nesse caso, ele vai retornar todos os elementos que tiverem o valor do atributo id de dentro de cada elemento em cada iteracao diferente do valor do argumento passado pela rota atraves do userId)
// entao a funcao delete vai retornar um response com o status da operacao, nesse caso acima, sendo referenciado utilizando a dependencia http-status-code do node. e esse .send sem nada e apenas para devolver o status (creio eu)