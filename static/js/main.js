// ============================================
// VALIDAÇÃO EM TEMPO REAL
// ============================================


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

document.addEventListener('DOMContentLoaded', function() {
    
    // VALIDAÇÃO DE EMAIL
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateEmail(this);
        });
    });

    // VALIDAÇÃO DE SENHA NO CADASTRO
    // VALIDAÇÃO DE SENHA NO CADASTRO
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
            
            if (senha !== confirmarSenha) {
                e.preventDefault();
                showError(confirmarSenhaInput, 'As senhas não coincidem!');
                return false;
            }
            
            if (senha.length < 6) {
                e.preventDefault();
                showError(senhaInput, 'A senha deve ter no mínimo 6 caracteres!');
                return false;
            }
        });
    }
});

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

// Função de mostrar erro
function showError(input, message) {
    input.classList.add('invalid');
    alert(message); // Podemos melhorar isso depois com toast
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