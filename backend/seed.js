const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const suppliers = [
  {
    id: uuidv4(),
    razaoSocial: 'Distribuidora ABC Ltda',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    telefone: '(11) 3456-7890',
    email: 'contato@distribuidorabc.com.br',
    contatoPrincipal: 'João Silva'
  },
  {
    id: uuidv4(),
    razaoSocial: 'Fornecedora XYZ S.A.',
    cnpj: '98.765.432/0001-12',
    endereco: 'Av. Principal, 456 - Rio de Janeiro, RJ',
    telefone: '(21) 2345-6789',
    email: 'vendas@fornecedoraxyz.com.br',
    contatoPrincipal: 'Maria Santos'
  },
  {
    id: uuidv4(),
    razaoSocial: 'Importadora Global Comércio',
    cnpj: '11.111.111/0001-11',
    endereco: 'Rua do Comércio, 789 - Belo Horizonte, MG',
    telefone: '(31) 9876-5432',
    email: 'info@importadoraglobal.com.br',
    contatoPrincipal: 'Carlos Oliveira'
  },
  {
    id: uuidv4(),
    razaoSocial: 'Distribuidora Sul Brasil',
    cnpj: '22.222.222/0001-22',
    endereco: 'Av. Central, 321 - Curitiba, PR',
    telefone: '(41) 1234-5678',
    email: 'contato@distsulbrasil.com.br',
    contatoPrincipal: 'Ana Costa'
  },
  {
    id: uuidv4(),
    razaoSocial: 'Fornecedora Nordeste Premium',
    cnpj: '33.333.333/0001-33',
    endereco: 'Rua do Pólo, 654 - Recife, PE',
    telefone: '(81) 4567-8901',
    email: 'vendas@nordestenordeste.com.br',
    contatoPrincipal: 'Pedro Alves'
  }
];

const products = [
  {
    id: uuidv4(),
    nome: 'Notebook Dell Inspiron',
    codigoBarras: '7891234567890',
    descricao: 'Notebook 15.6 polegadas, Intel i5, 8GB RAM',
    quantidade: 25,
    categoria: 'Eletrônicos',
    preco: 3500.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Mouse Logitech MX Master',
    codigoBarras: '7891234567891',
    descricao: 'Mouse sem fio, 2.4GHz, precisão alta',
    quantidade: 50,
    categoria: 'Periféricos',
    preco: 250.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Teclado Mecânico RGB',
    codigoBarras: '7891234567892',
    descricao: 'Teclado mecânico, 104 teclas, iluminação RGB',
    quantidade: 30,
    categoria: 'Periféricos',
    preco: 450.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Monitor LG 27 polegadas',
    codigoBarras: '7891234567893',
    descricao: 'Monitor Full HD, 27 polegadas, IPS',
    quantidade: 15,
    categoria: 'Monitores',
    preco: 1200.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Webcam Logitech HD',
    codigoBarras: '7891234567894',
    descricao: 'Webcam 1080p, microfone integrado',
    quantidade: 40,
    categoria: 'Periféricos',
    preco: 300.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'SSD Samsung 1TB',
    codigoBarras: '7891234567895',
    descricao: 'SSD NVMe M.2, 1TB, velocidade 3500MB/s',
    quantidade: 20,
    categoria: 'Armazenamento',
    preco: 600.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Memória RAM Kingston 16GB',
    codigoBarras: '7891234567896',
    descricao: 'RAM DDR4, 16GB, 3200MHz',
    quantidade: 35,
    categoria: 'Componentes',
    preco: 400.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Processador Intel i7 12ª Gen',
    codigoBarras: '7891234567897',
    descricao: 'CPU Intel Core i7-12700K, 12 núcleos',
    quantidade: 10,
    categoria: 'Componentes',
    preco: 2500.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Placa Mãe ASUS ROG',
    codigoBarras: '7891234567898',
    descricao: 'Placa mãe LGA1700, suporte DDR5',
    quantidade: 12,
    categoria: 'Componentes',
    preco: 1800.00,
    dataValidade: null
  },
  {
    id: uuidv4(),
    nome: 'Fonte 850W 80+ Gold',
    codigoBarras: '7891234567899',
    descricao: 'Fonte modular 850W, eficiência 80+ Gold',
    quantidade: 18,
    categoria: 'Componentes',
    preco: 750.00,
    dataValidade: null
  }
];

const createAssociations = (suppliers, products) => {
  const associations = [];
  
  suppliers.forEach((supplier) => {
    const numProducts = Math.floor(Math.random() * 3) + 2;
    const shuffled = products.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numProducts; i++) {
      associations.push({
        id: uuidv4(),
        supplierId: supplier.id,
        productId: shuffled[i].id
      });
    }
  });
  
  return associations;
};

const associations = createAssociations(suppliers, products);

const seedDatabase = () => {
  console.log('🌱 Iniciando população do banco de dados...\n');

  suppliers.forEach((supplier) => {
    db.run(
      `INSERT INTO suppliers (id, razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal, dataCadastro)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [supplier.id, supplier.razaoSocial, supplier.cnpj, supplier.endereco, supplier.telefone, supplier.email, supplier.contatoPrincipal],
      (err) => {
        if (err) {
          console.log(`❌ Erro ao inserir fornecedor ${supplier.razaoSocial}: ${err.message}`);
        } else {
          console.log(`✅ Fornecedor inserido: ${supplier.razaoSocial}`);
        }
      }
    );
  });

  products.forEach((product) => {
    db.run(
      `INSERT INTO products (id, nome, codigoBarras, descricao, preco, quantidade, categoria, dataValidade, dataCadastro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [product.id, product.nome, product.codigoBarras, product.descricao, product.preco, product.quantidade, product.categoria, product.dataValidade],
      (err) => {
        if (err) {
          console.log(`❌ Erro ao inserir produto ${product.nome}: ${err.message}`);
        } else {
          console.log(`✅ Produto inserido: ${product.nome}`);
        }
      }
    );
  });

  associations.forEach((association) => {
    db.run(
      `INSERT INTO supplier_product (id, supplierId, productId, dataCadastro)
       VALUES (?, ?, ?, datetime('now'))`,
      [association.id, association.supplierId, association.productId],
      (err) => {
        if (err) {
          console.log(`❌ Erro ao inserir associação: ${err.message}`);
        } else {
          console.log(`✅ Associação inserida`);
        }
      }
    );
  });

  console.log('\n🎉 População do banco finalizada!');
};

seedDatabase();