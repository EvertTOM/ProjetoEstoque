import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Fornecedores from './pages/Fornecedores';
import Produtos from './pages/Produtos';
import Associacoes from './pages/Associacoes';
import ProdutoDetalhes from './pages/ProdutoDetalhes';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">

                <nav className="navbar">
                    <h1>📦 Gerenciador de Estoque</h1>

                    <div className="nav-buttons">
                        <Link to="/fornecedores"><button>Fornecedores</button></Link>
                        <Link to="/produtos"><button>Produtos</button></Link>
                        <Link to="/associacoes"><button>Associações</button></Link>
                    </div>
                </nav>

                <main className="container">
                    <Routes>

                        {/* Rota inicial */}
                        <Route path="/" element={<Produtos />} />

                        {/* Rotas principais */}
                        <Route path="/fornecedores" element={<Fornecedores />} />
                        <Route path="/produtos" element={<Produtos />} />
                        <Route path="/associacoes" element={<Associacoes />} />

                        {/* TELA DE DETALHES – EXIGIDA PELA APOSTILA */}
                        <Route path="/produtos/:id" element={<ProdutoDetalhes />} />

                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}

export default App;