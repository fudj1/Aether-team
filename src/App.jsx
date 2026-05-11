import { useState } from 'react';
import { Layout, Button } from 'antd';
import { Save, Settings, Undo, Redo, Hand, PenLine } from 'lucide-react';
import Sidebar from './components/Sidebar';

const { Header, Content, Sider } = Layout;

function App() {

  return (
      <Layout>
        <Sider width={260} theme="light" className="h-screen">
          <Header className="bg-white! px-4! ">
            <Button color="default" variant="solid" shape="round" className="font-medium!">
              crm builder
            </Button>
          </Header>
          <Content>
            <Sidebar />
          </Content>
        </Sider>
        <Layout>
          <Header className="bg-white! w-full flex px-4! items-center">
            <div>Новый CRM / Дашборд</div>
            <div className="ml-auto flex gap-2">
              <Button type="text" shape="circle" icon={<span><PenLine size={18} /></span>} />
              <Button type="text" shape="circle" icon={<span><Hand size={18} /></span>} />
              <Button type="text" shape="circle" icon={<span><Undo size={18} /></span>} />
              <Button type="text" shape="circle" icon={<span><Redo size={18}/></span>} />

              <Button type="primary" shape="round" icon={<span><Settings size={16} /></span>}>
                Администратор
              </Button>
              <Button type="primary" shape="round" icon={<span><Save size={16} /></span>}>
                Сохранить
              </Button>
            </div>
          </Header>
          <Content>
          </Content>
        </Layout>
      </Layout>
  );
}

export default App;