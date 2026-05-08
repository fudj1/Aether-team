import { useState } from 'react';
import { Layout, Button } from 'antd';
import { Save, Settings, Undo, Redo, Hand, PenLine } from 'lucide-react';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [schema, setSchema] = useState({ components: [] });

  return (
      <Layout className="layout-container">
        <Sider width={260} className="sidebar-left">
          <div className="logo-badge">
            CRM builder
          </div>
        </Sider>

        <Layout style={{ marginLeft: 260 }}>
          <Header className="header-main" style={{ width: 'calc(100% - 260px)' }}>
            <div className="breadcrumb-path">Новый CRM / Дашборд</div>

            <div className="header-actions">
              <Button type="text" shape="circle" icon={<PenLine size={18} />} />
              <Button type="text" shape="circle" icon={<Hand size={18} />} />
              <Button type="text" shape="circle" icon={<Undo size={18} />} />
              <Button type="text" shape="circle" icon={<Redo size={18} />} />

              <Button type="primary" shape="round" icon={<Settings size={16} />}>
                Администратор
              </Button>
              <Button type="primary" shape="round" icon={<Save size={16} />}>
                Сохранить
              </Button>
            </div>
          </Header>
        </Layout>
      </Layout>
  );
}

export default App;