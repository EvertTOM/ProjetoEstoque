import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nome, setNome] = useState("");
    const [codigoBarras, setCodigoBarras] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [categoriaOutro, setCategoriaOutro] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataValidade, setDataValidade] = useState("");

    const [editando, setEditando] = useState(null);

    const navigate = useNavigate();
    const API_URL = "http://localhost:3001/api/products";

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            setLoading(true);
            const r = await axios.get(API_URL);
            setProdutos(r.data);
        } catch {
            alert("Erro ao carregar produtos.");
        } finally {
            setLoading(false);
        }
    };

    const limparCampos = () => {
        setNome("");
        setCodigoBarras("");
        setPreco("");
        setCategoria("");
        setCategoriaOutro("");
        setQuantidade("");
        setDescricao("");
        setDataValidade("");
        setEditando(null);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        const categoriaFinal =
            categoria === "Outro" ? categoriaOutro.trim() : categoria;

        if (!nome || !codigoBarras || !preco || !categoriaFinal) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const dados = {
            nome: nome,
            codigoBarras: codigoBarras,
            preco: preco,
            categoria: categoriaFinal,
            quantidade: quantidade || 0,
            descricao: descricao || "",
            dataValidade: dataValidade || null
        };

        try {
            if (editando) {
                await axios.put(`${API_URL}/${editando.id}`, dados);
                alert("Produto atualizado com sucesso!");
            } else {
                await axios.post(API_URL, dados);
                alert("Produto cadastrado com sucesso!");
            }

            limparCampos();
            carregarProdutos();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Erro ao salvar produto."
            );
        }
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Deseja excluir este produto?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Produto excluído!");
            carregarProdutos();
        } catch {
            alert("Erro ao excluir produto.");
        }
    };

    const handleEditar = (p) => {
        setEditando(p);
        setNome(p.nome);
        setCodigoBarras(p.codigoBarras);
        setPreco(p.preco);

        const categoriasPadrao = [
            "Eletrônicos",
            "Alimentos",
            "Vestuário",
            "Higiene",
            "Limpeza",
            "Bebidas",
            "Informática",
            "Ferramentas"
        ];

        if (categoriasPadrao.includes(p.categoria)) {
            setCategoria(p.categoria);
            setCategoriaOutro("");
        } else {
            setCategoria("Outro");
            setCategoriaOutro(p.categoria);
        }

        setQuantidade(p.quantidade);
        setDescricao(p.descricao);
        setDataValidade(p.dataValidade);
    };

    if (loading) return <div>Carregando...</div>;

    const titulo = {
        color: "#003366",
        fontWeight: "bold",
        marginBottom: "3px",
        marginTop: "10px"
    };

    const inputStyle = {
        marginBottom: "12px",
        padding: "6px"
    };

    return (
        <div className="page">
            <h2>Gerenciar Produtos</h2>

            <form onSubmit={handleSalvar} className="form">
                <div style={titulo}>Nome</div>
                <input
                    type="text"
                    placeholder="Nome do Produto"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={inputStyle}
                />

                <div style={titulo}>Código de Barras</div>
                <input
                    type="text"
                    placeholder="Código de Barras"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    style={inputStyle}
                />

                <div style={titulo}>Preço</div>
                <input
                    type="number"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    style={inputStyle}
                />

                <div style={titulo}>Categoria</div>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Selecione uma categoria</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Informática">Informática</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Outro">Outro</option>
                </select>

                {categoria === "Outro" && (
                    <>
                        <div style={titulo}>Outra Categoria</div>
                        <input
                            type="text"
                            placeholder="Digite a Categoria"
                            value={categoriaOutro}
                            onChange={(e) => setCategoriaOutro(e.target.value)}
                            style={inputStyle}
                        />
                    </>
                )}

                <div style={titulo}>Quantidade</div>
                <input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    style={inputStyle}
                />

                <div style={titulo}>Descrição</div>
                <input
                    type="text"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={inputStyle}
                />

                <div style={titulo}>Data de Validade</div>
                <input
                    type="date"
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
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
                        <th>Nome</th>
                        <th>Código</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Qtd</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {produtos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.codigoBarras}</td>
                            <td>{p.categoria}</td>
                            <td>{p.preco}</td>
                            <td>{p.quantidade}</td>
                            <td>
                                <button onClick={() => handleEditar(p)}>Editar</button>
                                <button onClick={() => handleDeletar(p.id)}>Deletar</button>
                                <button onClick={() => navigate(`/produtos/${p.id}`)}>Detalhes</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Produtos;