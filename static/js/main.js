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
        
        // Validação no submit
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
            
            // Se passou nas validações (quando tiver backend, vai enviar)
            showToast('Produto cadastrado com sucesso!', 'success', 'Tudo certo!');
            
            // Limpar formulário
            setTimeout(() => {
                productForm.reset();
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
            }, 1500);
        });
    }
});