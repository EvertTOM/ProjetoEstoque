import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [loading, setLoading] = useState(true);

    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [contatoPrincipal, setContatoPrincipal] = useState('');

    const [editando, setEditando] = useState(null);

    const API_URL = 'http://localhost:3001/api/suppliers';

    useEffect(() => {
        carregarFornecedores();
    }, []);

    const carregarFornecedores = async () => {
        try {
            setLoading(true);
            const r = await axios.get(API_URL);
            setFornecedores(r.data);
        } catch {
            alert("Erro ao carregar fornecedores.");
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        if (!razaoSocial || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const dados = {
            razaoSocial,
            cnpj,
            endereco,
            telefone,
            email,
            contatoPrincipal
        };

        try {
            if (editando) {
                await axios.put(`${API_URL}/${editando.id}`, dados);
                alert("Fornecedor atualizado com sucesso!");
            } else {
                await axios.post(API_URL, dados);
                alert("Fornecedor cadastrado com sucesso!");
            }

            limparCampos();
            carregarFornecedores();

        } catch (error) {
            alert(error.response?.data?.message || "Erro ao salvar fornecedor.");
        }
    };

    const limparCampos = () => {
        setRazaoSocial('');
        setCnpj('');
        setEndereco('');
        setTelefone('');
        setEmail('');
        setContatoPrincipal('');
        setEditando(null);
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Deseja excluir este fornecedor?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Fornecedor excluído!");
            carregarFornecedores();
        } catch {
            alert("Erro ao excluir fornecedor.");
        }
    };

    const handleEditar = (f) => {
        setEditando(f);
        setRazaoSocial(f.razaoSocial);
        setCnpj(f.cnpj);
        setEndereco(f.endereco);
        setTelefone(f.telefone);
        setEmail(f.email);
        setContatoPrincipal(f.contatoPrincipal);
    };

    if (loading) return <div>Carregando...</div>;

    // ESTILO CORRIGIDO — AGORA FICA ENCOSTADO EM CIMA DO INPUT
    const tituloCampo = {
        color: "#003366",
        fontWeight: "bold",
        marginBottom: "2px",   // COLADO
        marginTop: "10px"
    };

    // REMOVE O ESPAÇO GIGANTE DO INPUT
    const inputStyle = {
        marginTop: "0px",
        marginBottom: "10px",
        padding: "6px"
    };

    return (
        <div className="page">
            <h2>Gerenciar Fornecedores</h2>

            <form onSubmit={handleSalvar} className="form">

                <div style={tituloCampo}>Razão Social</div>
                <input
                    type="text"
                    placeholder="Insira o nome da empresa"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    style={inputStyle}
                />

                <div style={tituloCampo}>CNPJ</div>
                <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    style={inputStyle}
                />

                <div style={tituloCampo}>Endereço</div>
                <input
                    type="text"
                    placeholder="Insira o endereço completo da empresa"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    style={inputStyle}
                />

                <div style={tituloCampo}>Telefone</div>
                <input
                    type="text"
                    placeholder="(00) 0000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    style={inputStyle}
                />

                <div style={tituloCampo}>E-mail</div>
                <input
                    type="email"
                    placeholder="exemplo@fornecedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />

                <div style={tituloCampo}>Contato Principal</div>
                <input
                    type="text"
                    placeholder="Nome do contato principal"
                    value={contatoPrincipal}
                    onChange={(e) => setContatoPrincipal(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit">
                    {editando ? "Atualizar" : "Adicionar"}
                </button>

                {editando && (
                    <button type="button" onClick={limparCampos}>
                        Cancelar
                    </button>
                )}

            </form>

            <table className="tabela">
                <thead>
                    <tr>
                        <th>Razão Social</th>
                        <th>CNPJ</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Contato</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {fornecedores.map(f => (
                        <tr key={f.id}>
                            <td>{f.razaoSocial}</td>
                            <td>{f.cnpj}</td>
                            <td>{f.endereco}</td>
                            <td>{f.telefone}</td>
                            <td>{f.email}</td>
                            <td>{f.contatoPrincipal}</td>
                            <td>
                                <button className="btn-editar" onClick={() => handleEditar(f)}>
                                    Editar
                                </button>
                                <button className="btn-deletar" onClick={() => handleDeletar(f.id)}>
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default Fornecedores;