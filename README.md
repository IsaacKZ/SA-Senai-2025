# 📦 SA Desapego

> Plataforma web de desapego desenvolvida para o projeto SA SENAI 2025

## 🎯 Sobre o Projeto

O **SA Desapego** é um site de classificados onde um administrador pode postar produtos para venda (desapego) e usuários podem visualizar os itens disponíveis com informações como nome, preço, foto, categoria, estado e descrição.

O site funciona como vitrine - os usuários demonstram interesse nos produtos e entram em contato externamente (WhatsApp, email, etc). As transações não são realizadas pela plataforma.

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Python 3.13**
- **Flask 3.1.0** - Framework web minimalista
- **Jinja2** - Template engine

### **Frontend**
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos customizados (sem frameworks)
- **JavaScript (Vanilla)** - Interatividade (sem bibliotecas)
- **SVG** - Ícones vetoriais

### **Ferramentas**
- **Git** - Controle de versão
- **GitHub** - Repositório remoto
- **VSCode** - Editor de código

## 🗺️ Rotas Disponíveis

| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | GET | Landing page (inicial) |
| `/produtos` | GET | Listagem de produtos |
| `/produto/<id>` | GET | Detalhes de um produto |
| `/login` | GET, POST | Página de login |
| `/cadastro` | GET, POST | Página de cadastro |
| `/perfil` | GET | Perfil do usuário |
| `/admin` | GET, POST | Adicionar novo produto |
| `/admin/produtos` | GET | Gerenciar produtos existentes |

### **✅ Concluído**
- [x] Design system completo
- [x] Landing page
- [x] Sistema de autenticação (UI)
- [x] Listagem de produtos com busca/filtros
- [x] Página de detalhes do produto
- [x] Área do admin (adicionar produtos)
- [x] Gerenciamento de produtos
- [x] Perfil do usuário
- [x] Validações frontend
- [x] Modais de confirmação
- [x] Animações e transições
- [x] Design responsivo

### **🚧 Em Desenvolvimento**
- [ ] Banco de dados
- [ ] Autenticação funcional (backend)
- [ ] CRUD de produtos real
- [ ] Upload de imagens
- [ ] Proteção de rotas
- [ ] Sistema de contato
- [ ] Deploy

---

## 📋 Próximos Passos

### **Fase 1: Backend Básico**
1. Configurar banco de dados (SQLite ou PostgreSQL)
2. Criar models (User, Product)
3. Implementar autenticação real com hash de senhas
4. Sistema de sessões

### **Fase 2: CRUD Completo**
1. Salvar produtos no banco de dados
2. Upload e armazenamento de imagens
3. Editar produtos existentes
4. Deletar produtos
5. Marcar produtos como vendidos

### **Fase 3: Funcionalidades Avançadas**
1. Sistema de contato (WhatsApp/Email)
2. Proteção de rotas (middleware admin_required)
3. Paginação de produtos
4. Busca avançada
5. Histórico de interesses do usuário

### **Fase 4: Deploy**
1. Preparar para produção
2. Configurar variáveis de ambiente
3. Deploy em Heroku/Render/Railway
4. Configurar domínio customizado (opcional)

---

## 👥 Autor

**Isaac Zoccatelli**
- GitHub: [@IsaacKZ](https://github.com/IsaacKZ)
- Email: isaackz2008@gmail.com
- Localização: Joinville, SC - Brasil
- Projeto: SA SENAI 2025

---

<p align="center">
  <strong>Feito com 💻 e ☕ para o SA SENAI 2025</strong>
</p>

<p align="center">
  <i>Frontend completo ✅ | Backend em breve 🚀</i>
</p>