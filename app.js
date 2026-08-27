import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ctaxovpcqnoymoxrahmf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oYw58rhxktCrQEPVRgss8A__iJoBhis';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function iniciarApp() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #f8f9fa; min-height: 100vh; padding-bottom: 70px; box-sizing: border-box;">
      <header style="background: #00264d; color: #fff; padding: 16px; text-align: center;">
        <h2 style="margin: 0; font-size: 18px;">Setembro 2026</h2>
        <span style="font-size: 12px; color: #a0c4ff;">Hospital Amparo</span>
      </header>

      <div style="padding: 16px; background: #fff; border-bottom: 1px solid #ddd;">
        <p style="font-size: 14px; margin: 0 0 8px 0; color: #555;">Selecione o dia para ver a escala:</p>
        <div id="botoes-dias" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;"></div>
      </div>

      <main style="padding: 16px;">
        <h3 id="titulo-dia" style="font-size: 15px; color: #333; margin-bottom: 12px;">Carregando plantões...</h3>
        <div id="lista-plantoes"></div>
      </main>

      <nav style="position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto; background: #fff; display: flex; justify-content: space-around; border-top: 1px solid #ddd; padding: 10px 0;">
        <button style="background:none; border:none; font-size:12px; color:#666; cursor:pointer;">Menu</button>
        <button style="background:none; border:none; font-size:12px; color:#003366; font-weight:bold; cursor:pointer;">Escalas</button>
        <button style="background:none; border:none; font-size:12px; color:#666; cursor:pointer;">Trocas</button>
        <button style="background:none; border:none; font-size:12px; color:#666; cursor:pointer;">Anúncios</button>
      </nav>
    </div>
  `;

  async function carregarPlantoes(dataIso) {
    const titulo = document.getElementById('titulo-dia');
    const lista = document.getElementById('lista-plantoes');
    
    const partesData = dataIso.split('-').reverse().join('/');
    titulo.innerText = `Plantões do dia ${partesData}`;
    lista.innerHTML = `<p style="text-align: center; color: #777;">Buscando dados...</p>`;

    const { data, error } = await supabase
      .from('plantoes')
      .select('*')
      .eq('data', dataIso);

    if (error) {
      lista.innerHTML = `<p style="text-align: center; color: red;">Erro ao carregar plantões.</p>`;
      return;
    }

    if (!data || data.length === 0) {
      lista.innerHTML = `<p style="text-align: center; color: #777;">Nenhum plantão cadastrado para este dia.</p>`;
      return;
    }

    lista.innerHTML = data.map(item => {
      const iniciais = item.medico.split(' ').map(n => n[0]).join('').substring(0, 2);
      const horarioFormatado = item.turno.replace('-', ' às ') + 'H';
      
      return `
        <div style="display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #e2d9f3; color: #5b32a7; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${iniciais}</div>
          <div style="flex: 1;">
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #222;">${item.medico}</h4>
            <p style="margin: 0; font-size: 11px; color: #666;">HEJ - PS - PRONTO ATENDIMENTO</p>
          </div>
          <div style="text-align: right; font-size: 13px; font-weight: bold; color: #00264d;">${horarioFormatado}</div>
        </div>
      `;
    }).join('');
  }

  const containerBotoes = document.getElementById('botoes-dias');
  for (let i = 1; i <= 15; i++) {
    const diaStr = i < 10 ? `0${i}` : `${i}`;
    const dataIso = `2026-09-${diaStr}`;
    
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.style.cssText = `border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer; font-weight: bold; font-size: 14px; background: ${i === 1 ? '#003366' : '#f0f0f0'}; color: ${i === 1 ? '#fff' : '#333'};`;
    
    btn.onclick = () => {
      document.querySelectorAll('#botoes-dias button').forEach(b => {
        b.style.background = '#f0f0f0';
        b.style.color = '#333';
      });
      btn.style.background = '#003366';
      btn.style.color = '#fff';
      carregarPlantoes(dataIso);
    };
    
    containerBotoes.appendChild(btn);
  }

  carregarPlantoes('2026-09-01');
}

iniciarApp();
