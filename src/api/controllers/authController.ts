import authService from '../../services/concrete/authService';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

export const register = async (ctx: any) => {
  console.log("Request User:", ctx.request.user); // Debug log

  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    return {
      status: 403,
      body: { message: "Auth header is missing" },
    };
  }

  const token = authHeader.split(" ")[1];
  let isAdmin = false;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    isAdmin = decoded.isAdmin || false;
  } catch (error) {
    return {
      status: 403,
      body: { message: "Geçersiz veya süresi dolmuş token." },
    };
  }

  if (!isAdmin) {
    return {
      status: 403,
      body: { message: "Yalnızca adminler kullanıcı oluşturabilir!" },
    };
  }

  // Kullanıcıyı kaydet
  const user = await authService.registerUser(ctx.body, true);
  return { status: 201, body: { message: "Kullanıcı başarıyla oluşturuldu!", user } };
};


export const login = async (ctx: any) => {
  try {
    const { email, password } = ctx.body;

    const { token, user } = await authService.loginUser({ email, password });
    return { status: 200, message: "Giriş başarılı!", token, user };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};

export const me = async (ctx: any) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    return {
      status: 403,
      body: { message: "Auth header is missing" },
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await authService.me(token);
    return { status: 200, body: user };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};
