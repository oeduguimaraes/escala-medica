import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Chaves oficiais configuradas do seu projeto no Supabase
const SUPABASE_URL = 'https://ctaxovpcqnoymoxrahmf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oYw58rhxktCrQEPVRgss8A__iJoBhis';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function EscalaMedicaApp() {
  const [dataSelecionada, setDataSelecionada] = useState('2026-09-01');
  const [plantoes, setPlantoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os plantões do dia selecionado no Supabase
  useEffect(() => {
    async function buscarPlantoes() {
      setCarregando(true);
      const { data, error } = await supabase
        .from('plantoes')
        .select('*')
        .eq('data', dataSelecionada);

      if (error) {
        console.error('Erro ao buscar plantões:', error);
      } else {
        setPlantoes(data || []);
      }
      setCarregando(false);
    }

    buscarPlantoes();
  }, [dataSelecionada]);

  // Função para gerar iniciais do nome (ex: "BRUNA VICENTE" -> "BV")
  const getIniciais = (nome) => {
    if (!nome) return 'MD';
    const partes = nome.trim().split(' ');
    if (partes.length > 1) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Setembro 2026</h2>
        <span style={styles.hospitalTag}>Hospital Amparo</span>
      </header>

      {/* Seletor de Dias de Setembro */}
      <div style={styles.dateSelector}>
        <p style={{fontSize: '14px', margin: '0 0 8px 0', color: '#555'}}>Selecione o dia para ver a escala:</p>
        <div style={styles.dateButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((dia) => {
            const realDiaStr = dia < 10 ? `2026-09-0${dia}` : `2026-09-${dia}`;
            return (
              <button 
                key={dia} 
                onClick={() => setDataSelecionada(realDiaStr)}
                style={{
                  ...styles.dayButton, 
                  backgroundColor: dataSelecionada === realDiaStr ? '#003366' : '#f0f0f0',
                  color: dataSelecionada === realDiaStr ? '#fff' : '#333'
                }}
              >
                {dia}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Plantões */}
      <main style={styles.main}>
        <h3 style={styles.sectionTitle}>Plantões do dia {dataSelecionada.split('-').reverse().join('/')} ({plantoes.length})</h3>
        
        {carregando ? (
          <p style={{textAlign: 'center', color: '#777'}}>Carregando plantões...</p>
        ) : plantoes.length === 0 ? (
          <p style={{textAlign: 'center', color: '#777'}}>Nenhum plantão cadastrado para este dia.</p>
        ) : (
          plantoes.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.avatar}>{getIniciais(item.medico)}</div>
              <div style={styles.info}>
                <h4 style={styles.medicoNome}>{item.medico}</h4>
                <p style={styles.localText}>HEJ - PS - PRONTO ATENDIMENTO</p>
              </div>
              <div style={styles.horarioBox}>
                <span style={styles.horarioText}>{item.turno.replace('-', ' às ')}H</span>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Menu Inferior Estilizado */}
      <nav style={styles.bottomNav}>
        <button style={styles.navButton}>Menu</button>
        <button style={{...styles.navButton, color: '#003366', fontWeight: 'bold'}}>Escalas</button>
        <button style={styles.navButton}>Trocas</button>
        <button style={styles.navButton}>Anúncios</button>
      </nav>
    </div>
  );
}

// Estilos visuais
const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '70px', boxSizing: 'border-box' },
  header: { backgroundColor: '#00264d', color: '#fff', padding: '16px', textAlign: 'center' },
  headerTitle: { margin: 0, fontSize: '18px' },
  hospitalTag: { fontSize: '12px', color: '#a0c4ff' },
  dateSelector: { padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #ddd' },
  dateButtons: { display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' },
  dayButton: { border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  main: { padding: '16px' },
  sectionTitle: { fontSize: '15px', color: '#333', marginBottom: '12px' },
  card: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2d9f3', color: '#5b32a7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px', flexShrink: 0 },
  info: { flex: 1 },
  medicoNome: { margin: '0 0 4px 0', fontSize: '15px', color: '#222' },
  localText: { margin: 0, fontSize: '11px', color: '#666' },
  horarioBox: { textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: '#00264d' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #ddd', padding: '10px 0' },
  navButton: { background: 'none', border: 'none', fontSize: '12px', color: '#666', cursor: 'pointer' }
};
