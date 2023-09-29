create database dindin; -- criação do banco de dados


-- tabela usuários
create table usuarios ( 
	id serial primary key,
  	nome text not null,
  	email text not null unique,
  	senha text not null
);

-- tabela categorias
create table categorias (
	id serial primary key,
  	descricao text not null
);

-- tabela transações
create table transacoes (
		id serial primary key,
  	tipo text not null,
  	descricao text not null,
		valor integer not null,
  	data timestamp not null,
  	usuario_id integer references usuarios(id),
  	categoria_id integer references categorias(id)
);

-- categorias
insert into categorias (descricao) 
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');