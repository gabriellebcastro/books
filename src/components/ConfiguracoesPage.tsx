import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Configuracoes.css';

export function ConfiguracoesPage() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return null; // ou um estado de carregamento/erro
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <main className="main-content">
      <div className="settings-page">
        <header className="clubes-header">
          <h1>Configurações</h1>
          <p>Personalize a sua experiência na plataforma.</p>
        </header>

        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Modo Dark</h3>
              <p>Alterne entre o tema claro e escuro.</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={theme === 'dark'} 
                onChange={toggleTheme} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}