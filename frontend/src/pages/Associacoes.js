import React, { useEffect, useState } from "react";
import axios from "axios";

function Associacoes() {
    const [fornecedores, setFornecedores] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [associacoes, setAssociacoes] = useState([]);

    const [supplierId, setSupplierId] = useState("");
    const [productId, setProductId] = useState("");

    const API_SUP = "http://localhost:3001/api/suppliers";
    const API_PROD = "http://localhost:3001/api/products";
    const API_ASSOC = "http://localhost:3001/api/associations";

    useEffect(() => {
        carregarFornecedores();
        carregarProdutos();
        carregarAssociacoes();
    }, []);

    const carregarFornecedores = async () => {
        try {
            const r = await axios.get(API_SUP);
            setFornecedores(r.data);
        } catch {
            alert("Erro ao carregar fornecedores.");
        }
    };

    const carregarProdutos = async () => {
        try {
            const r = await axios.get(API_PROD);
            setProdutos(r.data);
        } catch {
            alert("Erro ao carregar produtos.");
        }
    };

    const carregarAssociacoes = async () => {
        try {
            const r = await axios.get(API_ASSOC);
            setAssociacoes(r.data);
        } catch {
            alert("Erro ao carregar associações.");
        }
    };

    const criarAssociacao = async (e) => {
        e.preventDefault();

        if (!supplierId || !productId) {
            alert("Selecione fornecedor e produto.");
            return;
        }

        try {
            const r = await axios.post(API_ASSOC, { supplierId, productId });
            alert(r.data.message);
            setSupplierId("");
            setProductId("");
            carregarAssociacoes();
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao associar.");
        }
    };

    const desassociar = async (id) => {
        if (!window.confirm("Deseja remover esta associação?")) return;

        try {
            const r = await axios.delete(`${API_ASSOC}/${id}`);
            alert(r.data.message);
            carregarAssociacoes();
        } catch {
            alert("Erro ao desassociar.");
        }
    };

    return (
        <div className="page">
            <h2>Associações</h2>

            <form onSubmit={criarAssociacao} className="form">

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

                <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                >
                    <option value="">Selecione um produto</option>
                    {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nome} - {p.codigoBarras}
                        </option>
                    ))}
                </select>

                <button type="submit">Associar</button>
            </form>

            <hr />

            <h3>Associações Existentes</h3>

            {associacoes.length === 0 && <p>Nenhuma associação encontrada.</p>}

            {associacoes.length > 0 && (
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Fornecedor</th>
                            <th>Produto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {associacoes.map((a) => (
                            <tr key={a.id}>
                                <td>{a.razaoSocial}</td>
                                <td>{a.nome}</td>
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

export default Associacoes;