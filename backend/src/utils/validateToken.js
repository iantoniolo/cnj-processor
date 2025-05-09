function validateToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, message: "Token não fornecido." };
  }
  const token = authHeader.replace("Bearer ", "").trim();
  if (token !== process.env.API_TOKEN) {
    return { valid: false, message: "Token inválido." };
  }
  return { valid: true };
}

module.exports = { validateToken };
