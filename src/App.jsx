
import React, { useState } from 'react';
import initialUsers from './users.json';


export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [filtro, setFiltro] = useState('');
  // Estado para armazenar o ID do usuário logado
  const [usuarioLogadoId, setUsuarioLogadoId] = useState(initialUsers[0].id);
  // Busca o usuário logado pelo ID
  const usuarioLogado = users.find(u => u.id === usuarioLogadoId);

  // Função para pegar a cor da linha conforme o nível
  const corDoNivel = (nivel) => {
    if (nivel === 1) return '#ffcccc'; // vermelho
    if (nivel === 2) return '#cce0ff'; // azul
    return '#ccffcc'; // verde
  };

  // Função para mudar o nível de um usuário específico
  const alterarNivel = (id, novoNivel) => {
    if (usuarioLogado.nivelAcesso !== 1) {
      alert("Acesso Negado: Apenas Nível 1 pode alterar permissões!");
      return;
    }

    const usuario = users.find(u => u.id === id);
    const novosUsuarios = users.map(user => {
      if (user.id === id) {
        return { ...user, nivelAcesso: parseInt(novoNivel) };
      }
      return user;
    });
    setUsers(novosUsuarios);

    // Alerta informando a mudança
    alert(`Nível de "${usuario.nome}" alterado de ${usuario.nivelAcesso} para ${novoNivel}`);
  };

  // Filtra os usuários em tempo real pelo nome, email ou cargo
  const usuariosFiltrados = users.filter(user =>
    user.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    user.email.toLowerCase().includes(filtro.toLowerCase()) ||
    user.cargo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Sistema de Controle de Acesso</h1>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="usuarioSelect">Logado como: </label>
        <select
          id="usuarioSelect"
          value={usuarioLogadoId}
          onChange={e => setUsuarioLogadoId(Number(e.target.value))}
          style={{ fontSize: '16px', padding: '4px', marginRight: '8px' }}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.nome}</option>
          ))}
        </select>
        <span>(Nível: {usuarioLogado.nivelAcesso})</span>
      </div>

      <hr />

      {/* Campo de busca para filtrar em tempo real */}
      <input
        type="text"
        placeholder="Buscar por nome, email ou cargo..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ padding: '8px', width: '100%', marginTop: '10px', marginBottom: '10px', fontSize: '16px' }}
      />

      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Nome</th>
            {/* Nível 3 (Leitor) só vê informações básicas */}
            {usuarioLogado.nivelAcesso !== 3 && <th>Email</th>}
            <th>Cargo</th>
            <th>Nível Atual</th>
            {/* Só mostra coluna de ações se for Admin (nível 1) */}
            {usuarioLogado.nivelAcesso === 1 && <th>Ações (Admin Only)</th>}
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(user => (
            <tr key={user.id} style={{ backgroundColor: corDoNivel(user.nivelAcesso) }}>
              <td>{user.nome}</td>
              {usuarioLogado.nivelAcesso !== 3 && <td>{user.email}</td>}
              <td>{user.cargo}</td>
              <td>
                <span>
                  Nível {user.nivelAcesso}
                </span>
              </td>
              {usuarioLogado.nivelAcesso === 1 && (
                <td>
                  <select
                    value={user.nivelAcesso}
                    onChange={(e) => alterarNivel(user.id, e.target.value)}
                  >
                    <option value="1">Nível 1 (Admin)</option>
                    <option value="2">Nível 2 (Editor)</option>
                    <option value="3">Nível 3 (Leitor)</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}