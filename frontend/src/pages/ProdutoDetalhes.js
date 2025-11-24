import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProdutoDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produto, setProduto] = useState(null);
    const [fornecedores, setFornecedores] = useState([]);
    const [associados, setAssociados] = useState([]);
    const [supplierId, setSupplierId] = useState("");

    const API_PROD = "http://localhost:3001/api/products";
    const API_SUP = "http://localhost:3001/api/suppliers";
    const API_ASSOC = "http://localhost:3001/api/associations";

    useEffect(() => {
        carregarProduto();
        carregarFornecedores();
        carregarAssociacoes();
    }, [id]);

    const carregarProduto = async () => {
        try {
            const r = await axios.get(`${API_PROD}/${id}`);
            setProduto(r.data);
        } catch {
            alert("Erro ao carregar produto.");
        }
    };

    const carregarFornecedores = async () => {
        try {
            const r = await axios.get(API_SUP);
            setFornecedores(r.data);
        } catch {
            alert("Erro ao carregar fornecedores.");
        }
    };

    const carregarAssociacoes = async () => {
        try {
            const r = await axios.get(`${API_ASSOC}/produto/${id}`);
            setAssociados(r.data);
        } catch {
            alert("Erro ao carregar associações.");
        }
    };

    const associarFornecedor = async (e) => {
        e.preventDefault();

        if (!supplierId) {
            alert("Selecione um fornecedor!");
            return;
        }

        try {
            const r = await axios.post(API_ASSOC, {
                supplierId,
                productId: id
            });

            alert(r.data.message);
            setSupplierId("");
            carregarAssociacoes();

        } catch (error) {
            alert(error.response?.data?.message || "Erro ao associar fornecedor.");
        }
    };

    const desassociar = async (assocId) => {
        if (!window.confirm("Deseja remover este fornecedor do produto?")) return;

        try {
            const r = await axios.delete(`${API_ASSOC}/${assocId}`);
            alert(r.data.message);
            carregarAssociacoes();

        } catch {
            alert("Erro ao desassociar fornecedor.");
        }
    };

    if (!produto) return <div>Carregando...</div>;

    return (
        <div className="page">

            {/* BOTÃO DE VOLTAR */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "15px",
                    padding: "6px 12px",
                    backgroundColor: "#003366",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Voltar
            </button>

            <h2>Associação de Fornecedor a Produto</h2>

            <h3>Detalhes do Produto</h3>

            <p><strong>Nome:</strong> {produto.nome}</p>
            <p><strong>Código de Barras:</strong> {produto.codigoBarras}</p>
            <p><strong>Descrição:</strong> {produto.descricao}</p>

            <hr />

            <h3>Associar Fornecedor</h3>

            <form onSubmit={associarFornecedor} className="form">

                <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                >
                    <option value="">Selecione um fornecedor</option>

                    {fornecedores.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.razaoSocial} - {f.cnpj}
                        </option>
                    ))}
                </select>

                <button type="submit">Associar Fornecedor</button>
            </form>

            <hr />

            <h3>Fornecedores Associados</h3>

            {associados.length === 0 && (
                <p>Nenhum fornecedor associado a este produto.</p>
            )}

            {associados.length > 0 && (
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Fornecedor</th>
                            <th>CNPJ</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {associados.map((a) => (
                            <tr key={a.id}>
                                <td>{a.razaoSocial}</td>
                                <td>{a.cnpj}</td>
                                <td>
                                    <button onClick={() => desassociar(a.id)}>
                                        Desassociar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default ProdutoDetalhes;