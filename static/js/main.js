// ============================================
// TOAST NOTIFICATIONS SYSTEM
// ============================================
function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Ícones para cada tipo
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    // Títulos padrão
    const defaultTitles = {
        success: 'Sucesso!',
        error: 'Erro!',
        warning: 'Atenção!',
        info: 'Informação'
    };
    
    const toastTitle = title || defaultTitles[type];
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${toastTitle}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// TOGGLE PARA VER/ESCONDER SENHA
// ============================================
function togglePassword(inputId) {
    // Pega todos os campos de senha na página
    const allPasswordInputs = document.querySelectorAll('input[type="password"], input[type="text"][id*="senha"]');
    const allButtons = document.querySelectorAll('.password-toggle');
    
    // Verifica o estado atual
    const currentInput = document.getElementById(inputId);
    const isPassword = currentInput.type === 'password';
    
    // Alterna TODOS os campos
    allPasswordInputs.forEach(input => {
        if (input.id.includes('senha') || input.name.includes('senha')) {
            input.type = isPassword ? 'text' : 'password';
        }
    });
    
    // Alterna TODOS os ícones
    const eyeOpen = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const eyeClosed = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    
    allButtons.forEach(button => {
        button.innerHTML = isPassword ? eyeClosed : eyeOpen;
    });
}

// ============================================
// VALIDAÇÃO EM TEMPO REAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // VALIDAÇÃO DE EMAIL (em tempo real)
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateEmail(this);
        });
    });

    // ============================================
    // VALIDAÇÃO DO LOGIN
    // ============================================
    const loginForm = document.querySelector('form[action="/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = loginForm.querySelector('#email').value;
            const senha = loginForm.querySelector('#senha').value;
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showToast('Por favor, insira um email válido!', 'error', 'Email inválido');
                return false;
            }
            
            // Validação de senha vazia
            if (senha.length === 0) {
                e.preventDefault();
                showToast('Por favor, insira sua senha!', 'warning', 'Campo obrigatório');
                return false;
            }
            
            if (senha.length < 6) {
                e.preventDefault();
                showToast('A senha deve ter no mínimo 6 caracteres!', 'warning', 'Senha muito curta');
                return false;
            }

            // NOTA: Validação real de credenciais será feita no backend
        });
    }

    // ============================================
    // VALIDAÇÃO DO CADASTRO
    // ============================================
    const cadastroForm = document.querySelector('form[action="/cadastro"]');
    if (cadastroForm) {
        const senhaInput = cadastroForm.querySelector('#senha');
        const confirmarSenhaInput = cadastroForm.querySelector('#confirmar_senha');
        
        // Adiciona barra de força da senha ABAIXO do confirmar senha
        const confirmarSenhaGroup = confirmarSenhaInput.closest('.form-group');
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength';
        strengthBar.innerHTML = '<div class="password-strength-bar"></div>';
        confirmarSenhaGroup.appendChild(strengthBar);
        
        const strengthText = document.createElement('div');
        strengthText.className = 'strength-text';
        confirmarSenhaGroup.appendChild(strengthText);

        // Validação em tempo real
        senhaInput.addEventListener('input', function() {
            checkPasswordStrength(this, strengthBar, strengthText);
        });

        confirmarSenhaInput.addEventListener('input', function() {
            checkPasswordMatch(senhaInput, confirmarSenhaInput);
        });

        // Validação no submit
        cadastroForm.addEventListener('submit', function(e) {
            const senha = senhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
            const email = cadastroForm.querySelector('#email').value;
            const nome = cadastroForm.querySelector('#nome').value;
            
            // Validação de nome
            if (nome.trim().length < 3) {
                e.preventDefault();
                showToast('O nome deve ter pelo menos 3 caracteres!', 'warning', 'Nome muito curto');
                return false;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showToast('Por favor, insira um email válido!', 'error', 'Email inválido');
                return false;
            }
            
            // Validação de senha
            if (senha.length < 6) {
                e.preventDefault();
                showToast('A senha deve ter no mínimo 6 caracteres!', 'warning', 'Senha muito curta');
                return false;
            }
            
            // Validação de senhas correspondentes
            if (senha !== confirmarSenha) {
                e.preventDefault();
                showToast('As senhas não coincidem!', 'error', 'Erro de validação');
                return false;
            }
        });
    }
});

// ============================================
// FUNÇÕES AUXILIARES DE VALIDAÇÃO
// ============================================

// Função de validação de email
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    if (input.value === '') {
        input.classList.remove('valid', 'invalid');
    } else if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
}

// Função de força da senha
function checkPasswordStrength(input, strengthBar, strengthText) {
    const password = input.value;
    const bar = strengthBar.querySelector('.password-strength-bar');
    
    if (password.length === 0) {
        bar.className = 'password-strength-bar';
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    
    // Critérios de força
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    bar.className = 'password-strength-bar';
    
    if (strength <= 2) {
        bar.classList.add('weak');
        strengthText.textContent = 'Senha fraca';
        strengthText.style.color = '#EF4444';
    } else if (strength <= 4) {
        bar.classList.add('medium');
        strengthText.textContent = 'Senha média';
        strengthText.style.color = '#F59E0B';
    } else {
        bar.classList.add('strong');
        strengthText.textContent = 'Senha forte';
        strengthText.style.color = '#10B981';
    }
}

// Função de verificação de senhas iguais
function checkPasswordMatch(senha, confirmarSenha) {
    if (confirmarSenha.value === '') {
        confirmarSenha.classList.remove('valid', 'invalid');
        return;
    }
    
    if (senha.value === confirmarSenha.value) {
        confirmarSenha.classList.remove('invalid');
        confirmarSenha.classList.add('valid');
    } else {
        confirmarSenha.classList.remove('valid');
        confirmarSenha.classList.add('invalid');
    }
}

// ============================================
// ANIMAÇÃO DE CARDS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});

// ============================================
// NAVEGAÇÃO ATIVA
// ============================================
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.style.color = 'var(--primary-color)';
        link.style.fontWeight = '600';
    }
});

console.log('🎨 SA Desapego carregado com sucesso!');

// ============================================
// ADMIN - PREVIEW EM TEMPO REAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    
    if (productForm) {
        const imagemInput = document.getElementById('imagem');
        const nomeInput = document.getElementById('nome');
        const precoInput = document.getElementById('preco');
        
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        const previewNome = document.getElementById('previewNome');
        const previewPreco = document.getElementById('previewPreco');
        
        // Preview da imagem
        imagemInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validar tamanho (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('A imagem deve ter no máximo 5MB!', 'error', 'Arquivo muito grande');
                    imagemInput.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    previewImage.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Preview do nome
        nomeInput.addEventListener('input', function() {
            previewNome.textContent = this.value || 'Nome do Produto';
        });
        
        // Preview do preço
        precoInput.addEventListener('input', function() {
            const valor = parseFloat(this.value) || 0;
            previewPreco.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
        });
        
        // Validação no submit - ABRE O MODAL
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = nomeInput.value.trim();
            const preco = precoInput.value;
            const categoria = document.getElementById('categoria').value;
            const estado = document.getElementById('estado').value;
            const descricao = document.getElementById('descricao').value.trim();
            const imagem = imagemInput.files[0];
            
            // Validações
            if (!imagem) {
                showToast('Por favor, selecione uma imagem!', 'error', 'Imagem obrigatória');
                return false;
            }
            
            if (nome.length < 3) {
                showToast('O nome deve ter pelo menos 3 caracteres!', 'warning', 'Nome muito curto');
                return false;
            }
            
            if (!preco || preco <= 0) {
                showToast('Insira um preço válido!', 'warning', 'Preço inválido');
                return false;
            }
            
            if (!categoria) {
                showToast('Selecione uma categoria!', 'warning', 'Campo obrigatório');
                return false;
            }
            
            if (!estado) {
                showToast('Selecione o estado do produto!', 'warning', 'Campo obrigatório');
                return false;
            }
            
            if (descricao.length < 10) {
                showToast('A descrição deve ter pelo menos 10 caracteres!', 'warning', 'Descrição muito curta');
                return false;
            }
            
            // Se passou nas validações, abre o modal
            openConfirmModal(nome, preco, categoria);
        });
    }
});

// ============================================
// MODAL DE CONFIRMAÇÃO
// ============================================
function openConfirmModal(nome, preco, categoria) {
    const modal = document.getElementById('confirmModal');
    const modalNome = document.getElementById('modalNome');
    const modalPreco = document.getElementById('modalPreco');
    const modalCategoria = document.getElementById('modalCategoria');
    
    // Preenche os dados do modal
    modalNome.textContent = nome;
    modalPreco.textContent = `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
    
    // Traduz categoria
    const categorias = {
        'eletronicos': 'Eletrônicos',
        'roupas': 'Roupas',
        'moveis': 'Móveis',
        'livros': 'Livros',
        'esportes': 'Esportes',
        'outros': 'Outros'
    };
    modalCategoria.textContent = categorias[categoria] || categoria;
    
    // Abre o modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners do modal
document.addEventListener('DOMContentLoaded', function() {
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const modal = document.getElementById('confirmModal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeConfirmModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeConfirmModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // Fecha o modal
            closeConfirmModal();
            
            // Mostra toast de sucesso
            showToast('Produto cadastrado com sucesso!', 'success', 'Tudo certo!');
            
            // Limpa o formulário
            const productForm = document.getElementById('productForm');
            if (productForm) {
                setTimeout(() => {
                    productForm.reset();
                    
                    const imagePreview = document.getElementById('imagePreview');
                    const previewImage = document.getElementById('previewImage');
                    const previewNome = document.getElementById('previewNome');
                    const previewPreco = document.getElementById('previewPreco');
                    
                    imagePreview.innerHTML = `
                        <div class="preview-placeholder">
                            <span class="preview-icon">📷</span>
                            <p>Clique ou arraste uma imagem</p>
                            <small>PNG, JPG, WEBP (max 5MB)</small>
                        </div>
                    `;
                    previewImage.innerHTML = '📦';
                    previewNome.textContent = 'Nome do Produto';
                    previewPreco.textContent = 'R$ 0,00';
                }, 500);
            }
        });
    }
    
    // Fechar ao clicar fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeConfirmModal();
            }
        });
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeConfirmModal();
        }
    });
});

// ============================================
// BUSCA E FILTROS DE PRODUTOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const filterCategoria = document.getElementById('filterCategoria');
    const filterEstado = document.getElementById('filterEstado');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const productsGrid = document.querySelector('.products-grid');
    
    if (searchInput && productsGrid) {
        
        // Função de filtrar produtos
        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const categoriaValue = filterCategoria.value.toLowerCase();
            const estadoValue = filterEstado.value.toLowerCase();
            
            const productCards = productsGrid.querySelectorAll('.product-card');
            let visibleCount = 0;
            
            productCards.forEach(card => {
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                
                // Por enquanto, dados fake - depois vem do backend
                const matchSearch = productName.includes(searchTerm);
                const matchCategoria = categoriaValue === '' || true;
                const matchEstado = estadoValue === '' || true;
                
                if (matchSearch && matchCategoria && matchEstado) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Mostrar mensagem se não houver resultados
            let noResults = document.querySelector('.no-results');
            if (visibleCount === 0) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.innerHTML = `
                        <div class="no-results-icon">🔍</div>
                        <h3>Nenhum produto encontrado</h3>
                        <p>Tente ajustar os filtros ou buscar por outro termo</p>
                    `;
                    productsGrid.parentElement.appendChild(noResults);
                }
            } else {
                if (noResults) {
                    noResults.remove();
                }
            }
        }
        
        // Event listeners
        searchInput.addEventListener('input', filterProducts);
        filterCategoria.addEventListener('change', filterProducts);
        filterEstado.addEventListener('change', filterProducts);
        
        // Limpar filtros
        clearFiltersBtn.addEventListener('click', function() {
            searchInput.value = '';
            filterCategoria.value = '';
            filterEstado.value = '';
            filterProducts();
            showToast('Filtros limpos!', 'info', 'Resetado');
        });
    }
});

// ============================================
// GERENCIAMENTO DE PRODUTOS
// ============================================

// Filtros de produtos
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const produtoItems = document.querySelectorAll('.produto-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active de todos
                filterBtns.forEach(b => b.classList.remove('active'));
                // Adiciona active no clicado
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                produtoItems.forEach(item => {
                    if (filter === 'todos') {
                        item.style.display = 'flex';
                    } else {
                        const status = item.getAttribute('data-status');
                        if (status === filter) {
                            item.style.display = 'flex';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // Event listeners para os botões de ação
    const btnEdits = document.querySelectorAll('.btn-edit');
    const btnSolds = document.querySelectorAll('.btn-sold');
    const btnDeletes = document.querySelectorAll('.btn-delete');
    
    btnEdits.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editarProduto(id);
        });
    });
    
    btnSolds.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const nome = this.getAttribute('data-nome');
            marcarVendido(id, nome);
        });
    });
    
    btnDeletes.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const nome = this.getAttribute('data-nome');
            excluirProduto(id, nome);
        });
    });
});

// Editar Produto
function editarProduto(id) {
    showToast('Função de edição será implementada no backend!', 'info', 'Em breve');
    // Quando tiver backend, redireciona para página de edição
    // window.location.href = `/admin/produto/editar/${id}`;
}

// Marcar como Vendido
let currentSoldId = null;

function marcarVendido(id, nome) {
    currentSoldId = id;
    document.getElementById('soldProductName').textContent = nome;
    document.getElementById('soldModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSoldModal() {
    document.getElementById('soldModal').classList.remove('active');
    document.body.style.overflow = '';
    currentSoldId = null;
}

document.addEventListener('DOMContentLoaded', function() {
    const confirmSoldBtn = document.getElementById('confirmSoldBtn');
    if (confirmSoldBtn) {
        confirmSoldBtn.addEventListener('click', function() {
            closeSoldModal();
            showToast('Produto marcado como vendido!', 'success', 'Sucesso');
            
            // Quando tiver backend, faz requisição aqui
            // fetch(`/admin/produto/${currentSoldId}/vendido`, { method: 'POST' })
            
            // Simula atualização visual
            setTimeout(() => {
                const item = document.querySelector(`.produto-item[data-id="${currentSoldId}"]`);
                if (item) {
                    item.setAttribute('data-status', 'vendido');
                    const badge = item.querySelector('.status-badge');
                    badge.className = 'status-badge status-vendido';
                    badge.innerHTML = '✕ Vendido';
                    
                    // Remove botões de editar e vendido
                    const btnEdit = item.querySelector('.btn-edit');
                    const btnSold = item.querySelector('.btn-sold');
                    if (btnEdit) btnEdit.remove();
                    if (btnSold) btnSold.remove();
                }
            }, 500);
        });
    }
});

// Excluir Produto
let currentDeleteId = null;

function excluirProduto(id, nome) {
    currentDeleteId = id;
    document.getElementById('deleteProductName').textContent = nome;
    document.getElementById('deleteModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    document.body.style.overflow = '';
    currentDeleteId = null;
}

document.addEventListener('DOMContentLoaded', function() {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
            showToast('Produto excluído com sucesso!', 'success', 'Removido');
            
            // Quando tiver backend, faz requisição aqui
            // fetch(`/admin/produto/${currentDeleteId}`, { method: 'DELETE' })
            
            // Simula remoção visual
            setTimeout(() => {
                const item = document.querySelector(`.produto-item[data-id="${currentDeleteId}"]`);
                if (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-50px)';
                    setTimeout(() => {
                        item.remove();
                        
                        // Verifica se ainda tem produtos
                        const remaining = document.querySelectorAll('.produto-item');
                        if (remaining.length === 0) {
                            document.querySelector('.produtos-lista').innerHTML = `
                                <div class="empty-state">
                                    <div class="empty-icon">📦</div>
                                    <h3>Nenhum produto cadastrado</h3>
                                    <p>Comece adicionando seu primeiro produto</p>
                                    <a href="/admin" class="btn-primary">Adicionar Produto</a>
                                </div>
                            `;
                        }
                    }, 300);
                }
            }, 500);
        });
    }
});

// ============================================
// PÁGINA DE PERFIL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const editToggle = document.getElementById('editToggle');
    const perfilForm = document.getElementById('perfilForm');
    const nomeInput = document.getElementById('nome');
    const formActions = document.getElementById('formActions');
    const cancelEdit = document.getElementById('cancelEdit');
    
    let nomeOriginal = '';
    
    // Toggle modo de edição
    if (editToggle) {
        editToggle.addEventListener('click', function() {
            nomeOriginal = nomeInput.value;
            nomeInput.disabled = false;
            nomeInput.focus();
            formActions.style.display = 'flex';
            editToggle.style.display = 'none';
        });
    }
    
    // Cancelar edição
    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            nomeInput.value = nomeOriginal;
            nomeInput.disabled = true;
            formActions.style.display = 'none';
            editToggle.style.display = 'flex';
        });
    }
    
    // Salvar alterações do perfil
    if (perfilForm) {
        perfilForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = nomeInput.value.trim();
            
            if (nome.length < 3) {
                showToast('O nome deve ter pelo menos 3 caracteres!', 'warning', 'Nome inválido');
                return false;
            }
            
            // Quando tiver backend, envia aqui
            showToast('Perfil atualizado com sucesso!', 'success', 'Salvo');
            
            nomeInput.disabled = true;
            formActions.style.display = 'none';
            editToggle.style.display = 'flex';
        });
    }
    
    // Trocar senha
    const senhaForm = document.getElementById('senhaForm');
    if (senhaForm) {
        senhaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const senhaAtual = document.getElementById('senha_atual').value;
            const senhaNova = document.getElementById('senha_nova').value;
            const senhaConfirmar = document.getElementById('senha_confirmar').value;
            
            if (senhaAtual.length === 0) {
                showToast('Digite sua senha atual!', 'warning', 'Campo obrigatório');
                return false;
            }
            
            if (senhaNova.length < 6) {
                showToast('A nova senha deve ter no mínimo 6 caracteres!', 'warning', 'Senha muito curta');
                return false;
            }
            
            if (senhaNova !== senhaConfirmar) {
                showToast('As senhas não coincidem!', 'error', 'Erro');
                return false;
            }
            
            // Quando tiver backend, valida e atualiza aqui
            showToast('Senha alterada com sucesso!', 'success', 'Atualizado');
            
            senhaForm.reset();
        });
    }
    
    // Excluir conta
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            document.getElementById('deleteAccountModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    const confirmDeleteAccount = document.getElementById('confirmDeleteAccount');
    if (confirmDeleteAccount) {
        confirmDeleteAccount.addEventListener('click', function() {
            closeDeleteAccountModal();
            showToast('Funcionalidade será implementada no backend!', 'info', 'Em breve');
            // Quando tiver backend, exclui conta e desloga
        });
    }
});

function closeDeleteAccountModal() {
    document.getElementById('deleteAccountModal').classList.remove('active');
    document.body.style.overflow = '';
}