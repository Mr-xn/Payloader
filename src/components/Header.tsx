import { useState } from 'react';
import { useAppContext } from '../App';
import { t, getText } from '../i18n';
import EncodingTools from './EncodingTools';

interface HeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

function Header({ sidebarCollapsed, setSidebarCollapsed }: HeaderProps) {
  const { globalVariables, setGlobalVariables, bypassMode, setBypassMode, activeTab, setActiveTab, theme, setTheme, searchQuery, setSearchQuery, language, setLanguage } = useAppContext();
  const [showVariables, setShowVariables] = useState(false);
  const [showEncoding, setShowEncoding] = useState(false);
  const currentRepoUrl = 'https://github.com/Mr-xn/Payloader';
  const originalRepoUrl = 'https://github.com/3516634930/Payloader';

  const updateVariable = (key: string, value: string) => {
    setGlobalVariables(prev => 
      prev.map(v => v.key === key ? { ...v, value } : v)
    );
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <div className="logo-content">
              <div className="logo-primary">
                <span className="logo-text">{t('header.logo', language)}</span>
                <span className="logo-subtitle">{t('header.subtitle', language)}</span>
              </div>
              <div className="logo-meta">
                <span className="build-badge">{t('header.browserEdition', language)}</span>
                <a
                  href={currentRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-link repo-link-current"
                  title={`${t('header.currentRepo', language)} · Mr-xn/Payloader`}
                >
                  Mr-xn/Payloader
                </a>
                <a
                  href={originalRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-link repo-link-original"
                  title={`${t('header.originalRepo', language)} · 3516634930/Payloader`}
                >
                  {t('header.originalRepo', language)}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={t('header.searchPlaceholder', language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
          <div className="tab-switcher">
            <button 
              className={`tab-btn ${activeTab === 'payloads' ? 'active' : ''}`}
              onClick={() => setActiveTab('payloads')}
            >
              {t('header.tabPayloads', language)}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              {t('header.tabTools', language)}
            </button>
          </div>
        </div>

        <div className="header-right">
          <button
            className="lang-toggle"
            onClick={toggleLanguage}
            title={t('lang.toggleTitle', language)}
          >
            {t('lang.toggle', language)}
          </button>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('header.themeToggleDark', language) : t('header.themeToggleLight', language)}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button 
            className="encoding-toggle"
            onClick={() => setShowEncoding(true)}
            title={t('header.encodingTitle', language)}
          >
            {t('header.encoding', language)}
          </button>

          <div className="mode-switcher">
            <span className="mode-label">{t('header.modeLabel', language)}</span>
            <button 
              className={`mode-btn ${bypassMode === 'normal' ? 'active' : ''}`}
              onClick={() => setBypassMode('normal')}
            >
              {t('header.modeNormal', language)}
            </button>
            <button 
              className={`mode-btn ${bypassMode === 'waf' ? 'active warning' : ''}`}
              onClick={() => setBypassMode('waf')}
            >
              {t('header.modeWaf', language)}
            </button>
            <button 
              className={`mode-btn ${bypassMode === 'edr' ? 'active danger' : ''}`}
              onClick={() => setBypassMode('edr')}
            >
              {t('header.modeEdr', language)}
            </button>
          </div>

          <div className="variables-dropdown">
            <button 
              className="variables-toggle"
              onClick={() => setShowVariables(!showVariables)}
            >
              {t('header.variables', language)}
            </button>
            {showVariables && (
              <div className="variables-panel">
                <div className="variables-header">
                  <h3>{t('header.variablesTitle', language)}</h3>
                  <span className="variables-hint">{t('header.variablesHint', language)}</span>
                </div>
                <div className="variables-list">
                  {globalVariables.map(variable => (
                    <div key={variable.key} className="variable-item">
                      <div className="variable-info">
                        <span className="variable-key">{`{${variable.key}}`}</span>
                        <span className="variable-desc">{getText(variable.description, language)}</span>
                      </div>
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => updateVariable(variable.key, e.target.value)}
                        className="variable-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .header {
            height: 60px;
            background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            position: relative;
            z-index: 100;
          }

          .header::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .menu-toggle {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            width: 36px;
            height: 36px;
            border-radius: 4px;
            font-size: 18px;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .menu-toggle:hover {
            border-color: var(--neon-cyan);
            color: var(--neon-cyan);
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .logo-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4px;
          }

          .logo-primary {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .logo-icon {
            font-size: 28px;
            filter: drop-shadow(0 0 10px var(--neon-cyan));
          }

          .logo-text {
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 3px;
            background: var(--gradient-cyber);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .logo-subtitle {
            font-size: 11px;
            color: var(--text-muted);
            letter-spacing: 1px;
            padding-left: 8px;
            border-left: 1px solid var(--border-color);
          }

          .logo-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .build-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 999px;
            border: 1px solid rgba(0, 240, 255, 0.35);
            background: rgba(0, 240, 255, 0.08);
            color: var(--neon-cyan);
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .repo-link {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 999px;
            border: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-muted);
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.6px;
            text-decoration: none;
            transition: all var(--transition-fast);
          }

          .repo-link:hover {
            border-color: var(--neon-cyan);
            color: var(--neon-cyan);
            transform: translateY(-1px);
          }

          .repo-link-current {
            color: var(--text-secondary);
          }

          .repo-link-original {
            border-color: rgba(255, 0, 85, 0.2);
          }

          .header-center {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
          }

          /* ===== Search Box ===== */
          .search-box {
            display: flex;
            align-items: center;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 0 10px;
            width: 260px;
            transition: all var(--transition-fast);
          }

          .search-box:focus-within {
            border-color: var(--neon-cyan);
            box-shadow: 0 0 12px rgba(0, 240, 255, 0.15);
            width: 320px;
          }

          .search-icon {
            font-size: 14px;
            margin-right: 6px;
            opacity: 0.6;
          }

          .search-input {
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-size: 13px;
            padding: 8px 0;
            flex: 1;
            outline: none;
            width: 100%;
          }

          .search-input::placeholder {
            color: var(--text-muted);
            font-size: 12px;
          }

          .search-input:focus {
            box-shadow: none;
            border: none;
          }

          .search-clear {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            transition: color var(--transition-fast);
          }

          .search-clear:hover {
            color: var(--neon-red);
          }

          .tab-switcher {
            display: flex;
            background: var(--bg-tertiary);
            border-radius: 6px;
            padding: 4px;
            border: 1px solid var(--border-color);
          }

          .tab-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            padding: 8px 20px;
            border-radius: 4px;
            font-family: var(--font-body);
            font-size: 13px;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .tab-btn:hover {
            color: var(--text-primary);
          }

          .tab-btn.active {
            background: var(--neon-cyan);
            color: var(--bg-primary);
            font-weight: 600;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          /* ===== Theme Toggle ===== */
          .lang-toggle {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .lang-toggle:hover {
            border-color: var(--neon-green);
            color: var(--neon-green);
            box-shadow: 0 0 12px rgba(0, 255, 136, 0.2);
          }

          .theme-toggle {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            width: 36px;
            height: 36px;
            border-radius: 6px;
            font-size: 18px;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .theme-toggle:hover {
            border-color: var(--neon-yellow);
            box-shadow: 0 0 12px rgba(255, 255, 0, 0.2);
            transform: scale(1.1);
          }

          .encoding-toggle {
            background: rgba(139, 0, 255, 0.1);
            border: 1px solid var(--neon-purple);
            color: var(--neon-purple);
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .encoding-toggle:hover {
            background: rgba(139, 0, 255, 0.2);
            box-shadow: 0 0 15px rgba(139, 0, 255, 0.3);
          }

          .mode-switcher {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-tertiary);
            padding: 4px 12px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
          }

          .mode-label {
            font-size: 12px;
            color: var(--text-muted);
          }

          .mode-btn {
            background: transparent;
            border: 1px solid transparent;
            color: var(--text-secondary);
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .mode-btn:hover {
            color: var(--text-primary);
          }

          .mode-btn.active {
            background: rgba(0, 240, 255, 0.1);
            border-color: var(--neon-cyan);
            color: var(--neon-cyan);
          }

          .mode-btn.active.warning {
            background: rgba(255, 102, 0, 0.1);
            border-color: var(--neon-orange);
            color: var(--neon-orange);
          }

          .mode-btn.active.danger {
            background: rgba(255, 0, 85, 0.1);
            border-color: var(--neon-red);
            color: var(--neon-red);
          }

          .variables-dropdown {
            position: relative;
          }

          .variables-toggle {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .variables-toggle:hover {
            border-color: var(--neon-cyan);
            color: var(--neon-cyan);
          }

          .variables-panel {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 400px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: var(--shadow-card);
            z-index: 1000;
          }

          .variables-header {
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
          }

          .variables-header h3 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .variables-hint {
            font-size: 11px;
            color: var(--text-muted);
          }

          .variables-list {
            max-height: 300px;
            overflow-y: auto;
          }

          .variable-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color);
          }

          .variable-item:last-child {
            border-bottom: none;
          }

          .variable-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .variable-key {
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--neon-cyan);
          }

          .variable-desc {
            font-size: 11px;
            color: var(--text-muted);
          }

          .variable-input {
            width: 150px;
            padding: 6px 10px;
            font-size: 12px;
          }
        `}</style>
      </header>

      {showEncoding && (
        <div className="encoding-modal-overlay" onClick={() => setShowEncoding(false)}>
          <div className="encoding-modal" onClick={e => e.stopPropagation()}>
            <div className="encoding-modal-header">
              <h2>{t('header.encodingModalTitle', language)}</h2>
              <button className="close-btn" onClick={() => setShowEncoding(false)}>×</button>
            </div>
            <div className="encoding-modal-body">
              <EncodingTools />
            </div>
            <style>{`
              .encoding-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.2s ease;
              }

              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              .encoding-modal {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                width: 95%;
                max-width: 1100px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.3s ease;
              }

              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .encoding-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 24px;
                border-bottom: 1px solid var(--border-color);
              }

              .encoding-modal-header h2 {
                font-size: 18px;
                font-weight: 600;
                color: var(--neon-purple);
              }

              .close-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                font-size: 28px;
                cursor: pointer;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all var(--transition-fast);
              }

              .close-btn:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
              }

              .encoding-modal-body {
                max-height: calc(90vh - 70px);
                overflow-y: auto;
              }

              .encoding-modal-body .encoding-tools {
                padding: 16px 24px;
              }

              .encoding-modal-body .encoding-header {
                display: none;
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
