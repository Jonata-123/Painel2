// Usuários de exemplo (não use em produção)
const FAKE_USERS = [
  { email: "admin@exemplo.com", password: "admin123", name: "Administrador" },
  { email: "user@exemplo.com", password: "senha123", name: "Usuário Teste" },
];

// --- Elementos ---
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const pwdInput = document.getElementById("password");
const togglePwdBtn = document.getElementById("togglePwd");
const rememberCheckbox = document.getElementById("remember");
const msgSuccess = document.getElementById("msg-success");
const emailError = document.getElementById("email-error");
const pwdError = document.getElementById("pwd-error");

// Inicializar: se existe "lembrar", preencher o email
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("rememberedUser");
  if (saved) {
    try {
      const obj = JSON.parse(saved);
      if (obj.email) {
        emailInput.value = obj.email;
        rememberCheckbox.checked = true;
      }
    } catch (e) {
      /* ignore */
    }
  }
});

// Mostrar / ocultar senha
togglePwdBtn.addEventListener("click", () => {
  const isHidden = pwdInput.type === "password";
  pwdInput.type = isHidden ? "text" : "password";
  togglePwdBtn.textContent = isHidden ? "Ocultar" : "Mostrar";
  togglePwdBtn.setAttribute("aria-pressed", String(isHidden));
});

// Validação simples
function validateForm() {
  let ok = true;

  if (!emailInput.checkValidity()) {
    emailError.style.display = "block";
    ok = false;
  } else {
    emailError.style.display = "none";
  }

  if (!pwdInput.checkValidity()) {
    pwdError.style.display = "block";
    ok = false;
  } else {
    pwdError.style.display = "none";
  }

  return ok;
}

// Simulação de autenticação
function authenticate(email, password) {
  const found = FAKE_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return new Promise((resolve) => {
    setTimeout(() => resolve(found || null), 700);
  });
}

// Submissão
loginForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  msgSuccess.style.display = "none";
  if (!validateForm()) return;

  const email = emailInput.value.trim();
  const password = pwdInput.value;

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Entrando...";

  try {
    const user = await authenticate(email, password);
    if (!user) {
      pwdError.style.display = "block";
      pwdError.textContent = "Email ou senha inválidos.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
      return;
    }

    msgSuccess.style.display = "block";
    msgSuccess.textContent = `Olá, ${user.name}! Login realizado com sucesso. (Simulação)`;

    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberedUser", JSON.stringify({ email }));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
    }, 900);
  } catch (err) {
    console.error(err);
    alert("Ocorreu um erro. Tente novamente.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
  }
});

// Esqueceu a senha
document.getElementById("forgot").addEventListener("click", (e) => {
  e.preventDefault();
  const email = prompt("Informe o seu email para receber instruções:");
  if (email) {
    alert(
      "Se esse email existir em nosso sistema, você receberá instruções (simulado)."
    );
  }
});
